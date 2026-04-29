package com.palette.api.service;

import com.palette.api.dto.*;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.*;
import com.palette.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QueryService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PalletRepository palletRepository;

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private QuerySellerRepository querySellerRepository;

    @Autowired
    private QueryPalletRepository queryPalletRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired
    private QuoteRepository quoteRepository;

    @Transactional
    public Query createQuery(String token, CreateQueryRequest request) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException(email));

        Company buyer = employee.getCompany();

        if (buyer == null) {
            throw new IllegalArgumentException("Employee has no company");
        }

        List<Company> sellers = companyRepository.findAllById(request.getSellers());

        Query newQuery = new Query();
        newQuery.setBuyer(buyer);
        newQuery.setIsClosed(false);
        newQuery.setDeadline(request.getDeadline());
        newQuery.setDeliveryRequest(request.isDeliveryRequest());

        final Query query = queryRepository.save(newQuery);

        List<QuerySeller> querySellers = sellers.stream().map(seller -> {
            QuerySeller querySeller = new QuerySeller();
            querySeller.setSeller(seller);
            querySeller.setQuery(query);
            return querySeller;
        }).collect(Collectors.toList());

        querySellerRepository.saveAll(querySellers);

        List<Message> messages = new ArrayList<>();

        for (Company seller : sellers) {
            List<Employee> employees = employeeRepository.findAllByCompany(seller);

            for (Employee sellerEmployee : employees) {
                Message message = new Message();
                message.setReceiver(sellerEmployee);
                message.setBody("You received a new query!");
                message.setRead(false);

                messages.add(message);

                if (sellerEmployee.isEmailNotificationEnabled()) {
                    mailService.sendQueryNotification(sellerEmployee);
                }
            }
        }

        messageRepository.saveAll(messages);

        List<QueryPallet> queryPallets = request.getItemQuantities().stream().map(itemQuantity -> {
            QueryPallet queryPallet = new QueryPallet();
            queryPallet.setQuantity(itemQuantity.getQuantity());

            Pallet pallet = palletRepository.findById(itemQuantity.getItemId())
                    .orElseThrow(() -> new RuntimeException("Pallet not found: " + itemQuantity.getItemId()));

            queryPallet.setPallet(pallet);
            queryPallet.setQuery(query);

            return queryPallet;
        }).collect(Collectors.toList());

        queryPalletRepository.saveAll(queryPallets);

        cartRepository.deleteByOwnerId(buyer.getId());

        return query;
    }

    @Transactional(readOnly = true)
    public QueryDetailsResponse getQueryDetails(String token, Long queryId) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException(email));

        Company company = employee.getCompany();
        if (company == null) {
            throw new IllegalArgumentException("Employee has no company");
        }

        Query query = queryRepository.findById(queryId)
                .orElseThrow(() -> new IllegalArgumentException("Query not found: " + queryId));

        List<QuerySeller> querySellers = querySellerRepository.findByQueryId(queryId);
        List<QueryPallet> queryPallets = queryPalletRepository.findByQueryId(queryId);
        List<Quote> latestQuotes = quoteRepository.findByQueryPalletQueryIdAndIsLatestTrue(queryId);

        boolean isBuyer = query.getBuyer() != null && Objects.equals(query.getBuyer().getId(), company.getId());
        boolean isSeller = querySellers.stream()
                .anyMatch(qs -> qs.getSeller() != null && Objects.equals(qs.getSeller().getId(), company.getId()));

        if (!isBuyer && !isSeller) {
            throw new IllegalArgumentException("You are not allowed to access this query");
        }

        QueryDetailsResponse response = new QueryDetailsResponse();
        response.setId(query.getId());
        response.setDeadline(query.getDeadline());
        response.setIsClosed(query.getIsClosed());

        QueryCompanyResponse buyerDto = new QueryCompanyResponse();
        buyerDto.setId(query.getBuyer().getId());
        buyerDto.setTitle(query.getBuyer().getTitle());
        response.setBuyer(buyerDto);

        List<QueryPalletDetailsResponse> palletDtos = queryPallets.stream().map(qp -> {
            QueryPalletDetailsResponse dto = new QueryPalletDetailsResponse();
            dto.setQueryPalletId(qp.getId());
            dto.setPallet(qp.getPallet());
            dto.setQuantity(qp.getQuantity());
            return dto;
        }).toList();
        response.setPallets(palletDtos);

        Map<Long, List<Quote>> quotesBySellerId = latestQuotes.stream()
                .filter(q -> q.getSeller() != null)
                .collect(Collectors.groupingBy(q -> q.getSeller().getId()));

        List<QuerySellerDetailsResponse> sellerDtos = querySellers.stream().map(qs -> {
            QuerySellerDetailsResponse sellerDto = new QuerySellerDetailsResponse();
            sellerDto.setSellerId(qs.getSeller().getId());
            sellerDto.setSellerTitle(qs.getSeller().getTitle());
            sellerDto.setSum(qs.getSum());
            sellerDto.setAccepted(qs.isAccepted());
            sellerDto.setRejected(qs.isRejected());

            List<QuerySellerQuoteResponse> quoteDtos = quotesBySellerId
                    .getOrDefault(qs.getSeller().getId(), Collections.emptyList())
                    .stream()
                    .map(quote -> {
                        QuerySellerQuoteResponse quoteDto = new QuerySellerQuoteResponse();
                        quoteDto.setQueryPalletId(quote.getQueryPallet().getId());
                        quoteDto.setPalletId(quote.getQueryPallet().getPallet().getId());
                        quoteDto.setPrice(quote.getPrice());
                        quoteDto.setIsLatest(quote.getIsLatest());
                        return quoteDto;
                    })
                    .toList();

            sellerDto.setQuotes(quoteDtos);
            return sellerDto;
        }).toList();

        response.setSellers(sellerDtos);

        return response;
    }
}