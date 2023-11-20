/* eslint-disable @typescript-eslint/no-explicit-any */
import { I_CommonObject, I_Node } from "../../../../utils/interface";
import axios from 'axios'

class SendMail_Node implements I_Node {
  type: string;
  category: string;
  baseClasess: string[];
  label: string;
  name: string;
  descriptionNode: string;
  mailData?: I_CommonObject | undefined;

  constructor() {
    this.label = 'Send Mail Node'
    this.name = 'sendMailNode'
    this.type = 'SendMail'
    this.category = 'Actions Nodes'
    this.descriptionNode = `loads variables in the context that will be used for the workflow`
    this.baseClasess = [this.type]
    this.mailData = {}
  }
  async run(): Promise<string | I_CommonObject> {
    if (this.mailData) {
      console.log(this.mailData);
      try {
        const response = await axios({
          method: 'get',
          url: 'http://localhost:3000/send-mail',
          data: this.mailData
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error al enviar el correo: ${error.message}`);
      }
    }
    throw new Error('mailData no está definido');
  }


}

export { SendMail_Node }
