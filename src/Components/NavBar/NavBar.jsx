import React,{Component} from 'react';
import {Navbar,Nav,NavDropdown,Container,Modal} from 'react-bootstrap';
import Home from './../Home/Home';
import User from './User/User'; 
import fire from './../../Config/Config';

class NavBar extends Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            userVisibility:false
        }
    }

    render()
    {
        return(
            <div>
                <Navbar variant="dark"bg="dark" fixed="top" expand="lg">
                    <Navbar.Brand>Sistema de Votación</Navbar.Brand>
                    <Navbar.Toggle className="btn" aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {this.props.children}
                        </Nav>
                        <Nav>
                            <NavDropdown title={this.props.Nombre}  id="basic-nav-dropdown"> 
                                
                                <Container className="text-center">
                                    <button 
                                        type="submit" 
                                        className="btn btn-info"
                                        onClick={()=>this.state.userVisibility?this.setState({userVisibility:false}):this.setState({userVisibility:true})}
                                    >Información</button>
                                    <NavDropdown.Divider />
                                    <button 
                                        type="submit" 
                                        className="btn btn-danger"
                                        onClick={()=>fire.auth().signOut()}    
                                    >Cerrar Sesión</button>
                                </Container>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <br/>
                <Modal size="lg" show={this.state.userVisibility} onHide={()=>this.setState({userVisibility:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Informacion de Usuario: </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <User/>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
export default NavBar;