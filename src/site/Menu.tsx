import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, Link, useLocation } from 'react-router-dom';
import DarkModeMenu from '../components/DarkModeMenu';
import { LocalTheme } from '../components/ThemeProvider';

export default function Menu() {
  let location = useLocation();
  return (
    <LocalTheme theme='dark'>
      <Navbar bg='body' className='mb-4'>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            React Academy Live
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav
              activeKey={location.pathname}
              variant='pills'
              className='me-auto'
            >
              <Nav.Link as={NavLink} to='/'>
                Page 1
              </Nav.Link>
              <Nav.Link as={NavLink} className='me-2' to='/page2'>
                Page 2
              </Nav.Link>
              <DarkModeMenu />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </LocalTheme>
  );
}
