import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
// try to use react-bootstrap
const Header = (props) => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">{props.displayName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link href="#home">Dashboard</Nav.Link>
            <Nav.Link href="#link">Chat</Nav.Link>
            </Nav>
            <Button inline variant="danger" onClick={props.logout}>Logout</Button>
        </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
