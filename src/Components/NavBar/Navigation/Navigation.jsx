import React, { Component } from 'react';
import NavBar from './../NavBar';
import Home from './../../Home/Home';
import AddContest from './../../AddContest/AddContest';
import AddParticipant from './../../AddParticipant/AddParticipant';

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                user: this.props.Numero_Control.substr(0, 8),
                homeVisibility: true,
                addContestVisibility: false,
                addParticipantVisibility: false
            }
    }

    render() {
        return (
            <>
                <NavBar Nombre={this.props.Nombre}>
                    <button
                        type="submit"
                        className="btn nav-link text-light"
                        onClick={() =>
                            this.setState({
                                homeVisibility: true,
                                addContestVisibility: false,
                                addParticipantVisibility: false
                            })

                        }
                    >Home</button>
                    {this.props.typeUsr ? <>
                        <button
                            type="submit"
                            className="btn nav-link text-light"
                            onClick={() =>
                                this.setState({
                                    homeVisibility: false,
                                    addContestVisibility: true,
                                    addParticipantVisibility: false
                                })
                            }
                        >Add Contest</button>
                        <button
                            type="submit"
                            className="btn nav-link text-light"
                            onClick={() =>
                                this.setState({
                                    homeVisibility: false,
                                    addContestVisibility: false,
                                    addParticipantVisibility: true
                                })
                            }
                        >Add Participant</button>
                    </> : null}
                </NavBar>

                {
                    this.state.homeVisibility ?
                        <Home Numero_Control={this.state.user} /> :
                        this.state.addContestVisibility ?
                            <AddContest /> :
                            this.state.addParticipantVisibility ?
                                <AddParticipant /> :
                                <Home Numero_Control={this.state.user} />
                }
            </>
        );
    }
}
export default Navigation;