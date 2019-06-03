import React, { Component } from 'react'
import {InputGroup} from 'react-bootstrap'
import fire from '../../Config/Config';
import { fileURLToPath } from 'url';


class Voting extends Component
{
    constructor(props)
    {
        super(props)
        this.state=
        {
            Seleccion:'',
            Participantes:[],
            image:''
        }
        this.votar=this.votar.bind(this)
    }
    async componentDidMount()
    {
        fire.storage().ref().child('Imagenes/Logo.png').getDownloadURL().then(url=>{
            var xhr = new XMLHttpRequest()
            xhr.responseType='blob'
            xhr.onload=function(event)
            {
                var blob = xhr.response
            }
            xhr.open('GET',url)
            xhr.send()
            this.setState({image:url})
            console.log(url)
        })
      
      
      
    }

    votar(Nombre,Ruta_Votante,Ruta_Participante)
    {
        this.props.Votar(Nombre,Ruta_Votante,Ruta_Participante)
    }
    render()
    {
        
        return(
               <li key={this.props.key} className="center list-group-item">
                   <div className="row">
                       <div className="col-2">
                            <img srcSet={this.state.image} width="100px" className="img-responsive" alt=""/>
                       </div>
                       <div className="col-8 text-center">
                           <br/>
                            <h2>{this.props.Nombre}</h2>
                       </div>
                       <div className="col-2">
                       <br/>
                            <button className="btn btn-primary"  onClick={()=>this.votar(this.props.Nombre,this.props.Ruta_Votante,this.props.Ruta_Participante)}>Votar</button>
                       </div>
                   </div>
                </li>
        );
    }
}
export default Voting;