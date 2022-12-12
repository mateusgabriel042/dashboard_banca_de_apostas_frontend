import React, {useState, useEffect, useContext} from 'react';
import Header from '../Header/index.jsx';
import { Table } from 'react-bootstrap';
import apiService from '../../../../services/api.js';
import Loading from '../../../../components/Loading/index.jsx';
import { Can } from "react-access-level";
import { verifyError } from '../../../../services/actionsAppService.jsx';

const View = ({ match, location }) => {
	const api = apiService.get()
	const [endpoint, setEndpoint] = useState('deposit');
	const [roleEndpoint, setRoleEndpoint] = useState('deposit');
	const [endpointSelected, setEndpointSelected] = useState([]);
	const [loading, setLoading] = useState(false);

	const {
	    params: { id }
	} = match;
	
	const view = () => {
		setLoading(true);
	    api.get(`api/${endpoint}/${id}`)
		.then(resp => {
			setEndpointSelected(resp.data.data.item);
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
									<td>Valor da transação</td>
									<td>{endpointSelected?.transaction_amount}</td>
								</tr>
								<tr>
									<td>Tipo de pagamento</td>
									<td>{endpointSelected?.type_payment}</td>
								</tr>
								<tr>
									<td>ID da coleção</td>
									<td>{endpointSelected?.colletion_id}</td>
								</tr>
								<tr>
									<td>Email do pagador</td>
									<td>{endpointSelected?.payer_email}</td>
								</tr>
								<tr>
									<td>Moeda</td>
									<td>{endpointSelected?.currency_id}</td>
								</tr>
								<tr>
									<td>Tipo da identificação</td>
									<td>{endpointSelected?.identification_type}</td>
								</tr>
								<tr>
									<td>Número da identificação</td>
									<td>{endpointSelected?.identification_number}</td>
								</tr>
								<tr>
									<td>Referencia externa</td>
									<td>{endpointSelected?.external_reference}</td>
								</tr>
								<tr>
									<td>QRCode</td>
									<td>{endpointSelected?.qr_code}</td>
								</tr>
								<tr>
									<td>Status</td>
									<td>{endpointSelected?.status}</td>
								</tr>
								<tr>
									<td>ID da transação</td>
									<td>{endpointSelected?.transaction_id}</td>
								</tr>
								<tr>
									<td>ID do banco da transferencia</td>
									<td>{endpointSelected?.bank_transfer_id}</td>
								</tr>
								<tr>
									<td>Usuário</td>
									<td>{endpointSelected?.user?.first_name} {endpointSelected?.user?.last_name}</td>
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