import { TemplateDelegate } from 'handlebars'

export interface TemplateData {
    name: string
}

export interface Templates {
    createUser: TemplateDelegate<TemplateData>
}
