import {  randomUUID} from 'crypto'
import { ResponseHelper } from '../utils/response-helper';

export class SettingsController {
    private static allSettings: any[] = [];

    static async saveConfig(payload: any){
        const jiraSetting = {
            id: randomUUID(),
            ...payload
        }
        this.allSettings.push(jiraSetting);

        return ResponseHelper.success('JIRA configuration saved', jiraSetting);
    }

    static async getConfig(){
        const setting = this.allSettings.length > 0 ? this.allSettings.slice(-1)[0] : {}
        return ResponseHelper.success('JIRA configuration', setting);
    }
}