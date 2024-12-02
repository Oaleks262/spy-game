import React , { useState }from 'react';
import Header from './Header';
import Footer from './Footer';
import FirstPage from './FirstPage';
import RulesPage from './RulesPage';
import AboutUsPage from './AboutUsPage';
import SupportPage from './SupportPage';
import '../../styles/Homepage.scss';




const Homepage = () => {
  const [page, setPage] = useState('FirstPage');

  const renderPage = () => {
      switch (page) {
          case 'RulesPage':
              return <RulesPage />;
          case 'AboutUsPage':
              return <AboutUsPage />;
          case 'SupportPage':
              return <SupportPage />;
          default:
              return <FirstPage />;
      }
  };
  return (
    <div className='border'>
        <div className='bashbord'>
            <Header setPage={setPage} />
            <div className='pages'>{renderPage()}</div>
            <Footer />
        </div>
    </div>
);
};

export default Homepage;