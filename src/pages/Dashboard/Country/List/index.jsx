import React, {useState, useEffect, useContext} from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiPencil, BiTrash, BiShowAlt, BiXCircle, BiFootball} from "react-icons/bi";
import Header from '../Header/index.jsx';
import apiService from '../../../../services/api.js';
import Loading from '../../../../components/Loading/index.jsx';
import Pagination from '../../../../components/Pagination/index.jsx';
import { Can } from "react-access-level";
import { showNotify, verifyError } from '../../../../services/actionsAppService.jsx';
import './style.css';

const List = ({ match, location }) => {
	const [endpointRegisters, setEndpointRegisters] = useState([]);
	const [endpoint, setEndpoint] = useState('country');
	const [roleEndpoint, setRoleEndpoint] = useState('country');
	const [loading, setLoading] = useState(false);
	const [toggleActive, setToggleActive] = useState(false);
	const [offset, setOffset] = useState(1);
	const [qtdPages, setQtdPages] = useState(1);
	const [leaguesSelected, setLeaguesSelected] = useState([]);
	
	const [leaguesFootballSelected, setLeaguesFootballSelected] = useState([]);
	const [leaguesBaseballSelected, setLeaguesBaseballSelected] = useState([]);
	const [leaguesBasketballSelected, setLeaguesBasketballSelected] = useState([]);


	const api = apiService.get();
	let valuePrev = localStorage.getItem('searchValuePrev');
	const {
	    params: { column, value }
	} = match;

	const [modalActiveLeagueShow, setModalActiveLeagueShow] = useState(false);

	const onHideModalActiveLeague = () => {setModalActiveLeagueShow(false);}

	const selectLeaguesCountry = (countryId) => {
		api.get(`api/league/by-country/${countryId}`)
		.then(resp => {
			setLeaguesSelected(resp.data.data.items);
			let data = resp.data.data.items;

			let leaguesFootball = [];
			let leaguesBaseball = [];
			let leaguesBasketball = [];

			data.forEach(function(item, index){
				switch(item.sport_name) {
					case 'Soccer':
						leaguesFootball.push(item);
				    	break;
					case 'Baseball':
						leaguesBaseball.push(item);
						break;
					case 'Basketball':
						leaguesBasketball.push(item);
				    	break;
					default:
				}
			});
			setLeaguesFootballSelected(leaguesFootball);
			setLeaguesBaseballSelected(leaguesBaseball);
			setLeaguesBasketballSelected(leaguesBasketball);

			setLoading(false);
		})
		.catch(error =>{
			showNotify('error', 'Ops, ocorreu algum erro!');
			setLoading(false);
			verifyError(error);
		})

		setModalActiveLeagueShow(true);
	}

	const toggleActiveLeague = (index) => {
		let leaguesTemp = leaguesSelected;
		leaguesTemp[index].is_active = !leaguesTemp[index].is_active;
		setLeaguesSelected(leaguesTemp);
		setToggleActive(true);
	}

	const saveActiveLeagues = () => {
		let data = {
			leagues: []
		};
		leaguesSelected.forEach(function(item){
			if(item.is_active){
				data.leagues.push({
					id: item.id,
					value: item.is_active
				});
			}
		});

		api.post(`api/league/update-active-leagues/`, data)
		.then(resp => {
			showNotify('success', 'Atualização realizada com sucesso!');
			list();
			setModalActiveLeagueShow(false);
			setLoading(false);
		})
		.catch(error =>{
			showNotify('error', 'Ops, ocorreu algum erro!');
			setLoading(false);
			verifyError(error);
		})
	}

	useEffect(() => {
		setToggleActive(false);
		setLeaguesSelected(leaguesSelected);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toggleActive])


	const list = () => {
		setLoading(true);
		let queryApi = '';
		if(typeof column !== "undefined" && typeof value !== "undefined"){
			if(valuePrev !== value){
				setOffset(1)
				localStorage.setItem('searchValuePrev', value);
			}
			queryApi = `api/${endpoint}/search/${column}/${value}?page=${offset}`;
		}else{
			queryApi = `api/${endpoint}?page=${offset}`;
		}
		
		api.get(queryApi)
		.then(resp => {
			setEndpointRegisters(resp.data.data.items);
			setQtdPages(resp.data.data.pagination.pages);
			setLoading(false);
		})
		.catch(error =>{
			showNotify('error', 'Ops, ocorreu algum erro!');
			setLoading(false);
			verifyError(error);
		})
	}
	
	const deleteEndpoint = (id, e) => {
		setLoading(true);
		api.delete(`api/${endpoint}/${id}`)
		.then(resp => {
			showNotify('success', 'O registro foi deletado com sucesso!');
			list();
			setLoading(false);
		})
		.catch(error =>{
			showNotify('error', 'Ops, ocorreu algum erro!');
			setLoading(false);
			verifyError(error);
		})
	}

	useEffect(() => {
		list();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [column, value, offset])


	return (
		<>
			<div className="area-crud">

				<Header></Header>

				<Can 
					resource={roleEndpoint}
					authority={`${roleEndpoint}-view`}
					otherwiseComponent={<label>Sem acesso!</label>}
				>
					<h5 className="mb-3">Todos os registros</h5>

					{ (loading) ? (<Loading />) : (

						(endpointRegisters?.length === 0) ? (
		                    <label>Nenhum registro encontrado...</label>
		                ) : (
		                	<div>
			                    <Table striped hover>
									<thead>
										<tr>
											<th>Nome</th>
											<th>Label</th>
											<th>Sigla</th>
											<th>Ativo</th>
											<th>Ações</th>
										</tr>
									</thead>
									<tbody>
										{endpointRegisters?.map((item) => (
											<tr key={item.id}>
												<td>{item.name}</td>
												<td>{item.label}</td>
												<td>{item.code}</td>
												<td>{item.is_active ? 'sim' : 'não'}</td>
												<td className="actions-4">
													<Can resource={roleEndpoint} authority={`${roleEndpoint}-view`}>
														<button type="button" onClick={() => selectLeaguesCountry(item.id)} className="btn bg-green"><BiFootball size="20" /></button>
													</Can>
													<Can resource={roleEndpoint} authority={`${roleEndpoint}-view`}>
														<Link to={`/dashboard/${roleEndpoint}/view/${item.id}`} className="btn bg-green">
															<BiShowAlt size="20" />
														</Link>
													</Can>
													<Can resource={roleEndpoint} authority={`${roleEndpoint}-update`}>
														<Link to={`/dashboard/${roleEndpoint}/edit/${item.id}`} className="btn bg-yellow">
															<BiPencil size="20" />
														</Link>
													</Can>
													<Can resource={roleEndpoint} authority={`${roleEndpoint}-delete`}>
														<Button className="bg-red" onClick={(e) => {if (window.confirm('Você realmente deseja excluir este registro?')) deleteEndpoint(item.id, e)}}>
															<BiTrash size="20" />
														</Button>
													</Can>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
								<Pagination
									qtdPages={qtdPages}
									offset={offset}
									setOffset={setOffset}
								/>

							</div>
		                )
		            )}
	            </Can>
	            
			</div>

			<Modal
                show={modalActiveLeagueShow}
                fullscreen={true}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <h1>País - Ligas</h1>

                    <h4 className="mt-4">Futebol</h4>
                	<div className="row">
                		{leaguesFootballSelected?.map((item, index) => (
	                    	<div className="col-4" key={index}>
		                    	<div className="form-check form-switch">
		                    		<label>{item.label_name}</label>
			                    	<input
			                            className="form-check-input"
			                            type="checkbox"
			                            checked={item?.is_active}
			                            value={!item?.is_active}
			                            onChange={(e) => toggleActiveLeague(index)}
			                        />
		                        </div>
		                    </div>
	                    ))}
                    </div>

                    <h4 className="mt-4">Basebol</h4>
                	<div className="row">
                		{leaguesBaseballSelected?.map((item, index) => (
	                    	<div className="col-4" key={index}>
		                    	<div className="form-check form-switch">
		                    		<label>{item.label_name}</label>
			                    	<input
			                            className="form-check-input"
			                            type="checkbox"
			                            checked={item?.is_active}
			                            value={!item?.is_active}
			                            onChange={(e) => toggleActiveLeague(index)}
			                        />
		                        </div>
		                    </div>
	                    ))}
                    </div>

                    <h4 className="mt-4">Basquetebol</h4>
                	<div className="row">
                		{leaguesBasketballSelected?.map((item, index) => (
	                    	<div className="col-4" key={index}>
		                    	<div className="form-check form-switch">
		                    		<label>{item.label_name}</label>
			                    	<input
			                            className="form-check-input"
			                            type="checkbox"
			                            checked={item?.is_active}
			                            value={!item?.is_active}
			                            onChange={(e) => toggleActiveLeague(index)}
			                        />
		                        </div>
		                    </div>
	                    ))}
                    </div>
					
					
                </Modal.Body>

                <Modal.Footer>
                	<Button onClick={() => saveActiveLeagues()}>Salvar</Button>
                    <Button onClick={onHideModalActiveLeague}>Fechar</Button>
                </Modal.Footer>
            </Modal>
		</>
	);
};

export default List;