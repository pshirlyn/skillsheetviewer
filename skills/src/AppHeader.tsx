import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { useCookies } from "react-cookie";
import useLogin from "./hooks/Login";
import useViewer, { Query } from "./hooks/Viewer";

const AppHeader: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const viewer = useViewer();
  const { logout } = useLogin();
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Skillsheet Viewer</NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(open => !open)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="mailto:sponsor@hackmit.org">Contact Us</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Hello {viewer(Query.name)}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={logout}>Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
      <br />
    </div>
  );
};

export default AppHeader;
