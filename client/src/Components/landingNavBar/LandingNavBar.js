import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
    const styles = {
        nav: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '60px',
          background: '#333',
          color: '#fff',
        },
        links: {
            display: 'flex',
            justifyContent: 'center', 
            listStyle: 'none',
            marginRight: '20px',
          },
          link: {
            color: 'inherit',
            textDecoration: 'none',
            marginRight: '20px',
            fontFamily: '"Lato", sans-serif', 
      
            ':hover': {
              color: '#00cccc',
            },
          },
          logo: {
            margin: '0 20px',
            fontSize: '20px',
            fontWeight: 'bold',
            fontFamily: '"Lato", sans-serif', 
          },
        signup: {
          display: 'flex',
          alignItems: 'center',
        },
        arrow: {
          marginLeft: '10px',
          fontSize: '16px',
        },
      };
    
      return (
        <>
        <head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" />
        </head>
        <nav style={styles.nav}>
        <div style={styles.signup}>
              <Link to="/about" style={styles.link}>About</Link>
              <Link to="/contact" style={styles.link}>Contact</Link>
        </div>

          <Link to="/" style={styles.link}>
            <span style={styles.logo}>Instajacked</span>
          </Link>
    
          <div style={styles.signup}>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>
              <span>Sign Up Free</span>
              <span style={styles.arrow}>&rarr;</span>
            </Link>
          </div>
        </nav>
        </>
      );
    };
export default LandingNavbar;