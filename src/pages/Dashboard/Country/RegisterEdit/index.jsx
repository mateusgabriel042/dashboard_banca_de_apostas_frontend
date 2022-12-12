import React, {useState, useEffect, useContext} from 'react';
import Header from '../Header/index.jsx';
import { Button, Form, Row, Col } from 'react-bootstrap';
import apiService from '../../../../services/api.js';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Loading from '../../../../components/Loading/index.jsx';
import { MultiSelect } from "react-multi-select-component";
import { Can } from "react-access-level";
import { showNotify, verifyError } from '../../../../services/actionsAppService.jsx';

const RegisterEdit = ({ match, location }) => {
	const {
	    params: { id }
	} = match;

	const [endpoint, setEndpoint] = useState('country');
	const [roleEndpoint, setRoleEndpoint] = useState('country');
	const api = apiService.get();
	const history = useHistory();
	const [errors, setErrors] = useState('');
	const [loading, setLoading] = useState(false);

	const { register, handleSubmit, setValue, getValues } = useForm();
	
	const onSubmit = data => {
		if(id !== undefined)
			update(data);
		else
			create(data);
	}

	const create = data => {
		setLoading(true);
		
		api.post(`api/${endpoint}`, data)
		.then(resp => {
			showNotify('success', 'Registro realizado com sucesso!');
			setLoading(false);
			history.push(`/dashboard/${endpoint}/list`);
		})
		.catch(error =>{
			showNotify('error', 'Ops, ocorreu algum erro!');
			setErrors(error?.response?.data?.data?.errors)
			setLoading(false);
			verifyError(error);
		})
	}

	const update = data => {
		setLoading(true);

		api.put(`api/${endpoint}/${id}`, data)
		.then(resp => {
			showNotify('success', 'Registro atualizado com sucesso!');
			setLoading(false);
			history.push(`/dashboard/${endpoint}/list`);
		})
		.catch(error =>{
			showNotify('error', 'Ops, ocorreu algum erro!');
			setErrors(error?.response?.data?.data?.errors);
			setLoading(false);
			verifyError(error);
		})
	}

	const initEndpoint = () => {
		setLoading(true);
		api.get(`api/${endpoint}/${id}`)
		.then(resp => {
			const data = resp.data.data.item;
			setValue("name", data.name);
			setValue("label", data.label);
			setValue("code", data.code);
			setValue("is_active", data.is_active);

			setLoading(false);
		})
		.catch(error =>{
			showNotify('error', 'Ops, ocorreu algum erro!');
			setErrors(error.message)
			verifyError(error);
		})
	}

	useEffect(() => {
		if(id !== undefined){
			initEndpoint();
		}else{
			document.getElementById('form-register').reset();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	return (
		<>
			<div className="area-crud">
				<Header></Header>

				<Can 
					resource={roleEndpoint}
					authority={`${roleEndpoint}-create`}
					otherwiseComponent={<label>Sem acesso!</label>}
				>
					<h5 className="mb-3">Formulário</h5>

					{ (loading) ? (<Loading />) : (null)}

					<Form onSubmit={handleSubmit(onSubmit)} className="form-register" id="form-register">
						<Row className="mb-3">
							<Col sm="3">
								<Form.Group>
								    <label htmlFor="name" className="form-label">Nome:<span className="req-span">*</span></label>
								    <input type="text" name="name" className="form-control" id="name" {...register("name")} />
								    <span className="error-message">{errors?.name ? errors.name[0] : null}</span>
								</Form.Group>
							</Col>

							<Col sm="3">
								<Form.Group>
								    <label htmlFor="label" className="form-label">Label:<span className="req-span">*</span></label>
								    <input type="text" name="label" className="form-control" id="label" {...register("label")} />
								    <span className="error-message">{errors?.label ? errors.label[0] : null}</span>
								</Form.Group>
							</Col>

							<Col sm="3">
								<Form.Group>
								    <label htmlFor="code" className="form-label">Sigla:<span className="req-span">*</span></label>
								    <input type="text" name="code" maxLength="4" className="form-control" id="code" {...register("code")} />
								    <span className="error-message">{errors?.code ? errors.code[0] : null}</span>
								</Form.Group>
							</Col>


							<Col sm="3">
								<Form.Group>
								    <label htmlFor="is_active" className="form-label">Ativo:</label>
								    <select className="form-select" name="is_active" {...register("is_active")} >
								    	<option value="">Selecionar</option>
								    	<option value="1" selected={id !== undefined && getValues("is_active") === 1 ? true : ""}>Sim</option>
									    <option value="0" selected={id !== undefined && getValues("is_active") === 0 ? true : ""}>Não</option>
							        </select>
								    <span className="error-message">{errors?.is_active ? errors.is_active[0] : null}</span>
								</Form.Group>
							</Col>
						</Row>

						

					    <Row className="mb-3">
					    	<Col>
					    		<Button type="submit" className="btn">{id !== undefined ? 'Salvar' : 'Cadastrar'}</Button>
					    	</Col>
					    </Row>
					    
					</Form>
				</Can>
			</div>
		</>
	);
};

export default RegisterEdit;