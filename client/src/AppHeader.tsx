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
import useLogin from "./hooks/useLogin";
import useViewer, { Query } from "./hooks/useViewer";

const AppHeader: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { redirectToDopeAuth } = useLogin();
  const { viewer, isLoggedIn } = useViewer();
  const { logout } = useLogin();
  const viewerButton = isLoggedIn ? (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Hello {viewer(Query.name)}
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={logout}>Logout</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  ) : (
    <NavItem>
      <NavLink onClick={redirectToDopeAuth}>Login with DopeAuth</NavLink>
    </NavItem>
  );
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
            {viewerButton}
          </Nav>
        </Collapse>
      </Navbar>
      <br />
    </div>
  );
};

export default AppHeader;
