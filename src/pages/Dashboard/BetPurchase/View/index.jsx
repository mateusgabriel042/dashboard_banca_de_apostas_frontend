import React, {useState, useEffect, useContext} from 'react';
import Header from '../Header/index.jsx';
import { Table } from 'react-bootstrap';
import apiService from '../../../../services/api.js';
import Loading from '../../../../components/Loading/index.jsx';
import { Can } from "react-access-level";
import { verifyError } from '../../../../services/actionsAppService.jsx';

const View = ({ match, location }) => {
	const api = apiService.get()
	const [endpoint, setEndpoint] = useState('bet-purchase');
	const [roleEndpoint, setRoleEndpoint] = useState('bet-purchase');
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
						<>
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
										<td>Usuário</td>
										<td>{endpointSelected?.user?.first_name} {endpointSelected?.user?.last_name}</td>
									</tr>
									<tr>
										<td>Valor da aposta</td>
										<td>{parseFloat(endpointSelected?.invested_money).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
									</tr>
									<tr>
										<td>Possivel retorno</td>
										<td>{parseFloat(endpointSelected?.return_money).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
									</tr>
									<tr>
										<td>Data da compra</td>
										<td>{endpointSelected?.date_purchase}</td>
									</tr>
								</tbody>
							</Table>

							<h5 className="mb-3">Apostas</h5>

							{endpointSelected.bets?.map((item) => (
								<Table striped hover key={item.id}>
									<thead>
										<tr>
											<th>Coluna</th>
											<th>Valor</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Id</td>
											<td>{item?.id}</td>
										</tr>
										
										<tr>
											<td>Tipo de evento</td>
											<td>{item?.type_event}</td>
										</tr>

										<tr>
											<td>Tipo de aposta</td>
											<td>{item?.type_bet}</td>
										</tr>

										<tr>
											<td>Subtipo de aposta</td>
											<td>{item?.subtype_bet}</td>
										</tr>

										<tr>
											<td>Aposta do cliente</td>
											<td>{item?.customer_bet}</td>
										</tr>

										<tr>
											<td>ID do Sporte</td>
											<td>{item?.apievents_sport_id}</td>
										</tr>

										<tr>
											<td>ID da liga</td>
											<td>{item?.apievents_league_id}</td>
										</tr>

										<tr>
											<td>ID da partida</td>
											<td>{item?.bet365_matche_id}</td>
										</tr>

										<tr>
											<td>ODD ID</td>
											<td>{item?.odd_id}</td>
										</tr>

										<tr>
											<td>ODD</td>
											<td>{parseFloat(item?.odd).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
										</tr>

										<tr>
											<td>Está ou ativo</td>
											<td>{item?.is_active ? 'Sim' : 'Não'}</td>
										</tr>

										<tr>
											<td>Ganhou (caso não esteja ativo)</td>
											<td>{item?.win ? 'Sim' : 'Não'}</td>
										</tr>

									</tbody>
								</Table>
							))}
						</>
					)}
				</Can>
				
			</div>
		</>
	);
};

export default View;