import React, {useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { BiTachometer, BiGroup, BiMenu, BiLock, BiUser, BiFootball } from "react-icons/bi";
import { SiBetfair } from "react-icons/si";

import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { RiUserStarLine } from "react-icons/ri";
import { BsMegaphone } from "react-icons/bs";
import { AiOutlineAlert } from "react-icons/ai";
import { FaRegBuilding } from "react-icons/fa";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { MdFamilyRestroom } from "react-icons/md";
import { Can, or } from "react-access-level";
import './style.css';

const Sidebar = () => {
	const [toggleNav, setToggleNav] = useState(true);

	const toggleSidebar = () => {
		const sidebarElement = document.getElementById('sidebar');
		const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
		const lbsLinkSidebar = document.getElementsByClassName('lb-link-sidebar');
		const logoSidebar = document.getElementById('logo-sidebar');
		const logotipo = document.getElementById('logotipo');
		
		if(toggleNav){
			sidebarElement.style.width = '70px';
			logoSidebar.style.display = 'none';
			logotipo.style.display = 'block';
			for(let i = 0; i < lbsLinkSidebar.length; i++){
				lbsLinkSidebar[i].style.display = 'none';
			}
			setToggleNav(false);
		}else {
			sidebarElement.style.width = '300px';
			setTimeout(function(){
				logoSidebar.style.display = 'block';
				logotipo.style.display = 'none';
				for(let i = 0; i < lbsLinkSidebar.length; i++){
					lbsLinkSidebar[i].style.display = 'block';
				}
			}, 300);
			
			setToggleNav(true);
		}
	}


	return (
		<>
			<div className="sidebar" id="sidebar">
				<div className="header-sidebar">
					<a href="/dashboard" className="text-decoration-none">
						<img className="logo-sidebar" id="logo-sidebar" src={`${process.env.PUBLIC_URL}/logos/logo-banca-de-apostas.png`} alt="logo" />
						<img className="logotipo" id="logotipo" src={`${process.env.PUBLIC_URL}/logos/logo-banca-de-apostas.png`} alt="logo" />
					</a>
				</div>

				{/*<button type="button" className="btn-toggle-sidebar" id="btn-toggle-sidebar" onClick={toggleSidebar}><BiMenu size="20px" /></button>*/}

				<div className="area-links">
					<div className="btn-toggle-sidebar">
						<button type="button" id="btn-toggle-sidebar" onClick={toggleSidebar}>
		            		<BiMenu size="25px" /><label className="lb-link-sidebar">Expandir</label>
		            	</button>
			        </div>

					<Can match={or("dashboard:dashboard-view", "dashboard:dashboard-delete", "dashboard:dashboard-update", "dashboard:dashboard-create")}>
			            <NavLink exact to="/dashboard" activeClassName="activeClicked">
			            	<BiTachometer size="25px" /><label className="lb-link-sidebar">Dashboard</label>
			            </NavLink>
		            </Can>

		            <Can match={or("user:user-view", "user:user-delete", "user:user-update", "user:user-create")}>
			            <NavLink to="/dashboard/user/list" activeClassName="activeClicked">
			            	<BiGroup size="25px" /><label className="lb-link-sidebar">Usuários</label>
			            </NavLink>
		            </Can>

		            <Can match={or("country:country-view", "country:country-delete", "country:country-update", "country:country-create")}>
			            <NavLink to="/dashboard/country/list" activeClassName="activeClicked">
			            	<BiFootball size="25px" /><label className="lb-link-sidebar">Países/Ligas</label>
			            </NavLink>
		            </Can>

		            <Can match={or("deposit:deposit-view", "deposit:deposit-delete", "deposit:deposit-update", "deposit:deposit-create")}>
			            <NavLink to="/dashboard/deposit/list" activeClassName="activeClicked">
			            	<GiReceiveMoney size="25px" /><label className="lb-link-sidebar">Depósitos</label>
			            </NavLink>
		            </Can>

		            <Can match={or("deposit:deposit-view", "deposit:deposit-delete", "deposit:deposit-update", "deposit:deposit-create")}>
			            <NavLink to="/dashboard/withdraw-money/list" activeClassName="activeClicked">
			            	<GiPayMoney size="25px" /><label className="lb-link-sidebar">Saques</label>
			            </NavLink>
		            </Can>

		            <Can match={or("deposit:deposit-view", "deposit:deposit-delete", "deposit:deposit-update", "deposit:deposit-create")}>
			            <NavLink to="/dashboard/bet-purchase/list" activeClassName="activeClicked">
			            	<SiBetfair size="25px" /><label className="lb-link-sidebar">Apostas</label>
			            </NavLink>
		            </Can>

		            <Can match={or("acl:acl-view", "acl:acl-delete", "acl:acl-update", "acl:acl-create")}>
			            <NavLink to="/dashboard/access-control/list" activeClassName="activeClicked">
			            	<BiLock size="25px" /><label className="lb-link-sidebar">Controle de acesso</label>
			            </NavLink>
		            </Can>

		            <NavLink to="/dashboard/profile/view" activeClassName="activeClicked">
		            	<BiUser size="25px" /><label className="lb-link-sidebar">Meu perfil</label>
		            </NavLink>
				</div>
			</div>
		</>
	);
};

export default Sidebar;