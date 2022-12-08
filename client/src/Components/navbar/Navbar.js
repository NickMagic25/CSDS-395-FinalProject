import { Link, useHistory, useLocation } from "react-router-dom";
import React, {useEffect, useState} from 'react'
import {changeUserName} from "../../pages/userProfile"
import {
    Collapse,
    Navbar as NavBar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
    Input,
    InputGroup,
    Button
  } from 'reactstrap';
import {FaSearch} from 'react-icons/fa'


export default function Navbar({changeUserName}) {

    const history = useHistory();
    const l = useLocation();

    const [searchBar, setSearchBar] = useState("");

    function logoff() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        history.push('/login');
    }


    function viewProfile() {
        history.push({pathname: '/userProfile', state: localStorage.getItem('username')});
    }

    function searchFriend(event) {
        //pass serach bar 
        console.log(searchBar);
        history.push({
            pathname: '/userProfile',
            state: searchBar
        })
        if(window.location.pathname === "/userProfile") {
            changeUserName(searchBar)
        }
        event.preventDefault();
    }

    const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

    return (
      <div>
      <NavBar color="light" light expand="md">
        <NavbarBrand href="/dashboard">InstaJacked</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <Form onSubmit={searchFriend} inline>
              <InputGroup>
              <Input onChange={(e) => setSearchBar(e.target.value)} type="text" placeholder="Search" className="mx-auto" />
              <Button outline color="secondary" type="submit"><FaSearch/></Button>
              </InputGroup>
            </Form>
          </Nav>
          <Nav navbar>
            <NavItem>
              <NavLink href="/workout">My Workouts</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/chat">Messages</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/friends">Friends</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
              <img
                  className="postProfileImg"
                  src ="/assets/person.jpg"
                  alt=""
                />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={viewProfile}>
                  User Profile
                </DropdownItem>
                <DropdownItem onClick={logoff}> 
                  Logoff
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </NavBar>
    </div>

    )

}