import {  randomUUID} from 'crypto'
import { ResponseHelper } from '../utils/response-helper';

export class SettingsController {
    private allSettings: any[] = [];

    async saveConfig(payload: any){
        const jiraSetting = {
            id: randomUUID(),
            ...payload
        }
        this.allSettings.push(jiraSetting);

        return ResponseHelper.success('JIRA configuration saved', jiraSetting);
    }

    async getConfig(){
        const setting = this.allSettings.length > 0 ? this.allSettings[-1] : {}
        return ResponseHelper.success('JIRA configuration', setting);
    }
}