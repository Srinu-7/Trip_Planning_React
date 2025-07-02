
import '../styles/homepage.css'; // Assuming you have a CSS file for styling
import NavBar from './NavBar/NavBar.jsx';
import Main from './Main/Main.jsx'; 
import Footer from './Footer/Footer.jsx';

const HomePage = () => {
  return (
    <div className="homepage">
      <NavBar/>
      <Main/>
      <Footer/>
    </div>
  );
};

export default HomePage;