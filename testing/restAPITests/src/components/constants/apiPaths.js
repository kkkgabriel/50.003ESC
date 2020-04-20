import {URL} from './constants';
export const reset = URL+"/reset";
export const agentlogin = URL+"/agentlogin";
export const endusercall = URL+"/endagentcall";
export const agentsignout = URL +"/agentsignout";
export const toggleagentavailability = URL + "/toggleagentavailability";
export const requestagent = URL + "/requestagent";
export const getanonymous = URL + "/getanonymous";
export const endagentcall = URL+"/endagentcall";



export function resetfn(login){
	if (login == null) {
		login = 0;
	}

	fetch(reset+"?availability="+login)
	.then(res =>{
		res.json().then(data=>{
			if (!data.done){
				console.log("FAILED TO RESET");
			} else {
				console.log("Reset "+login+" done");
			}
		})
	})
}