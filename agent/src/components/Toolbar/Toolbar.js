import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
// try to use react-bootstrap
const Toolbar = (props) => {
    return (
        <Navbar bg="dark" variant="dark" expand="sm">
        <Navbar.Brand href="#home">{props.displayName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
                <Navbar.Text style={{margin: "0 8px"}}>
                    Status: {props.available ? <span style={{color: "lightgreen"}}>Available</span>: <span style={{color: "red"}}>Unavailable</span>}
                </Navbar.Text>
            </Nav>
            <Button inline variant="light" style={{margin: "0 8px"}}
                onClick={props.toggleIsAgentAvailable}
                disabled={props.isInCall}>
                    {props.available ? "Take a break" : "Resume"}
            </Button>
            <Button inline variant="danger" onClick={props.logout} style={{margin: "0 8px"}}>Logout</Button>
        </Navbar.Collapse>
        </Navbar>
    )
}

export default Toolbar
