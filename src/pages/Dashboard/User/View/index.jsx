import React, {useState, useEffect, useContext} from 'react';
import Header from '../Header/index.jsx';
import { Table } from 'react-bootstrap';
import apiService from '../../../../services/api.js';
import Loading from '../../../../components/Loading/index.jsx';
import { Can } from "react-access-level";
import { verifyError } from '../../../../services/actionsAppService.jsx';

const View = ({ match, location }) => {
	const api = apiService.get()
	const [endpoint, setEndpoint] = useState('user');
	const [roleEndpoint, setRoleEndpoint] = useState('user');
	const [endpointSelected, setEndpointSelected] = useState([]);
	const [loading, setLoading] = useState(false);

	const {
	    params: { id }
	} = match;
	
	const view = () => {
		setLoading(true);
	    api.get(`api/${endpoint}/${id}`)
		.then(resp => {
			setEndpointSelected(resp.data.data.user);
			setLoading(false);
		})
		.catch(error =>{
			setLoading(false);
			verifyError(error);
		})
	}

	
	useEffect(() => {
		view();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	

	return (
		<>
			<div className="area-crud">
				<Header></Header>

				<Can 
					resource={roleEndpoint}
					authority={`${roleEndpoint}-view`}
					otherwiseComponent={<label>Sem acesso!</label>}
				>
					<h5 className="mb-3">Dados do registro</h5>

					{ (loading) ? (<Loading />) : (
						<Table striped hover>
							<thead>
								<tr>
									<th>Coluna</th>
									<th>Valor</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Id</td>
									<td>{endpointSelected?.id}</td>
								</tr>
								<tr>
									<td>Nome</td>
									<td>{endpointSelected?.first_name} {endpointSelected?.last_name}</td>
								</tr>
								<tr>
									<td>Data de nascimento</td>
									<td>{endpointSelected?.birth_date}</td>
								</tr>
								<tr>
									<td>Sexo</td>
									<td>{endpointSelected?.sex}</td>
								</tr>
								<tr>
									<td>CPF</td>
									<td>{endpointSelected?.cpf}</td>
								</tr>
								<tr>
									<td>Ganhos</td>
									<td>{endpointSelected?.money}</td>
								</tr>
								<tr>
									<td>Telefone movel</td>
									<td>{endpointSelected?.mobile_phone}</td>
								</tr>
								<tr>
									<td>Email</td>
									<td>{endpointSelected?.email}</td>
								</tr>
								<tr>
									<td>Usuário (login)</td>
									<td>{endpointSelected?.username}</td>
								</tr>
							</tbody>
						</Table>
					)}
				</Can>
				
			</div>
		</>
	);
};

export default View;