package com.palette.api.service;

import com.palette.api.dto.CreateQueryRequest;
import com.palette.api.dto.ItemQuantity;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.exception.PalletNotFoundException;
import com.palette.api.model.*;
import com.palette.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QueryService {
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

    @Transactional
    public Query createQuery(String token, CreateQueryRequest request){

        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));

        List<Company> sellers = companyRepository.findAllById(request.getSellers());
        List<Long> palletIds = request.getItemQuantities().stream().map(ItemQuantity::getItemId).collect(Collectors.toList());
        Query newQuery = new Query();
        newQuery.setBuyer(employee.getCompany());
        newQuery.setIsClosed(false);
        final Query query = queryRepository.save(newQuery);

        List<QuerySeller> querySellers = sellers.stream().map(
                seller -> {
                    QuerySeller querySeller = new QuerySeller();
                    querySeller.setSeller(seller);
                    querySeller.setQuery(query);
                    return querySeller;
                }
        ).collect(Collectors.toList());
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

        List<QueryPallet> queryPallets = request.getItemQuantities().stream().map(
                itemQuantity -> {
                    QueryPallet queryPallet = new QueryPallet();
                    queryPallet.setQuantity(itemQuantity.getQuantity());
                    Pallet pallet = palletRepository.findById(itemQuantity.getItemId()).orElseThrow(() ->new PalletNotFoundException(itemQuantity.getItemId()));
                    queryPallet.setPallet(pallet);
                    queryPallet.setQuery(query);
                    return queryPallet;
                }
        ).collect(Collectors.toList());
        queryPalletRepository.saveAll(queryPallets);

        return query;
    }
}
