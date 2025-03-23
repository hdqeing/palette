import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Layout.css"; // Import CSS

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}
