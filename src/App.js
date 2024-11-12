import React from 'react';
import './assetss/css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './components/Login';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Dashboard_Secretarias from './components/Dashboard_Secretarias';
import Dashboard_Patologos from './components/Dashboard_Patologos';
import Dashboard_Tecnologos from './components/Dashboard_Tecnologos';
import Editar from './components/Editar';
import Editar_Secretarias from './components/Editar_Secretarias'
import Editar_Patologos from './components/Editar_Patologos'
import Editar_Tecnologos from './components/Editar_Tecnologos'
import Editar_Examenes_Adicionales from './components/Editar_Examenes_Adicionales'

function App() {
  document.title = "Formularios Topología";
  return (
    <React.Fragment>
        <Router forceRefresh={true}>
            <Switch>
                <Route path ="/" exact render ={props=> (<Login{...props} />)}></Route>
                <Route path ="/dashboard_secretarias" exact render ={props=> (<Dashboard_Secretarias{...props} />)}></Route> 
                <Route path ="/dashboard_patologos" exact render ={props=> (<Dashboard_Patologos{...props} />)}></Route> 
                <Route path ="/dashboard_tecnologos" exact render ={props=> (<Dashboard_Tecnologos{...props} />)}></Route> 
                <Route path ="/dashboard" exact render ={props=> (<Dashboard{...props} />)}></Route> 
                <Route path ="/editar/:id" exact render ={props=> (<Editar{...props} />)}></Route>
                <Route path ="/editar_secretarias/:codigo_unico_examen" exact render ={props=> (<Editar_Secretarias{...props} />)}></Route>
                <Route path ="/editar_patologos/:codigo_unico_examen" exact render ={props=> (<Editar_Patologos{...props} />)}></Route>
                <Route path ="/editar_tecnologos/:codigo_unico_examen" exact render ={props=> (<Editar_Tecnologos{...props} />)}></Route>
                <Route path ="/editar_examenes_adicionales/:codigo_unico_examen" exact render ={props=> (<Editar_Examenes_Adicionales{...props} />)}></Route>
            </Switch>
        </Router>
    </React.Fragment>
  );
}

export default App;
