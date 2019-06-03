import React,{Component} from 'react';
import fire from '../../Config/Config'

class ParticipantsRecords extends Component
{
    constructor(props)
    {
        super(props);
        this.Eliminar=this.Eliminar.bind(this)
    }
    Eliminar(Id,Ruta)
    {
        if(window.confirm('¿Esta seguro de que quiere eliminar este registro?'))
            fire.database().ref(Ruta).child(Id).remove().then(()=>{
                window.alert('Registro Eliminado Exitosamente!!, Refresque la pagina para ver el cambio')
            }).catch(error=>{
                window.alert('Registro No Eliminado')
            })       
    }
    render()
    {
        return(<>
            <div className="row">
                <div className="col-3">
                    {this.props.Participante}
                </div> 
                <div className="col-3">
                    {this.props.Alias}
                </div>
                <div className="col-3">
                    {this.props.Evento}
                </div> 
                <div className="col-3">
                    <div className="mr-2">
                        <button type="submit" onClick={()=>this.Eliminar(this.props.participantId,this.props.Ruta)} className="btn btn-danger">Eliminar</button>
                    </div>
                    
                </div> 
            </div>
            <br/>
            </>
        )
    }
}
export default ParticipantsRecords;