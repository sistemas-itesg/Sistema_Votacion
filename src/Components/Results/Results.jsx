import React,{ Component } from 'react'
import {ProgressBar} from 'react-bootstrap'
class Results extends Component
{
    constructor()
    {
        super()
    }
    render()
    {
        return(<>
            {
                this.props.Resultados.map(item=>{
                    return(
                        <div className="row">
                            <div className="col-6 text-center">
                                <h2>{item.Nombre}</h2>
                            </div>
                            <div className="col-6 text-center mh-100">
                                <ProgressBar animated striped now={item.Votos} label={item.Votos} key={item.Id}/>
                            </div>
                        </div>
                    )
                })
            }
       </> );
    }
}
export default Results;