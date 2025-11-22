interface AzureOpenAIConfig {
  apiKey: string
  endpoint: string
  deployment: string
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: ChatMessage
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class AzureOpenAIService {
  private config: AzureOpenAIConfig

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY ?? '',
      endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT ?? '',
      deployment: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT ?? ''
    }

    if (!this.config.apiKey || !this.config.endpoint || !this.config.deployment) {
      console.warn('[AzureOpenAI] Missing config values; running in disabled stub mode. Set VITE_AZURE_OPENAI_API_KEY, VITE_AZURE_OPENAI_ENDPOINT, VITE_AZURE_OPENAI_DEPLOYMENT to enable real calls.')
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.chat([
        { role: 'user', content: 'Hello, this is a connection test.' }
      ])
      
      return response !== null
    } catch (error) {
      console.error('Azure OpenAI connection test failed:', error)
      return false
    }
  }

  async chat(messages: ChatMessage[], maxTokens: number = 1000): Promise<string | null> {
    try {
      const response = await fetch(`${this.config.endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey
        },
        body: JSON.stringify({
          model: this.config.deployment,
          messages,
          max_tokens: maxTokens,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ChatResponse = await response.json()
      return data.choices[0]?.message?.content || null
    } catch (error) {
      console.error('Azure OpenAI chat error:', error)
      return null
    }
  }

  // A.R.E.S specific methods
  async generateScopeOfWork(projectDetails: {
    customer: string
    location: string
    equipment: string
    requirements: string[]
  }): Promise<string | null> {
    const systemPrompt = `You are A.R.E.S (Advanced Retail Equipment Systems), an AI assistant specialized in creating professional scope of work documents for beverage equipment installation and maintenance.

Your task is to create a detailed, professional scope of work document based on the provided project details. The document should be:
- Clear and comprehensive
- Technically accurate
- Professional in tone
- Include all necessary steps and requirements
- Follow industry best practices

Format the response as a well-structured document with proper headings and sections.`

    const userPrompt = `Create a scope of work document for:

Customer: ${projectDetails.customer}
Location: ${projectDetails.location}
Equipment: ${projectDetails.equipment}
Requirements: ${projectDetails.requirements.join(', ')}

Please include sections for:
1. Project Overview
2. Scope of Work
3. Equipment Specifications
4. Installation Requirements
5. Timeline
6. Quality Standards
7. Safety Requirements
8. Testing and Commissioning
9. Documentation and Training
10. Warranty and Support`

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }

  async generateJobEstimate(projectDetails: {
    equipment: string
    laborHours: number
    complexity: 'low' | 'medium' | 'high'
    location: string
    specialRequirements: string[]
  }): Promise<string | null> {
    const systemPrompt = `You are A.R.E.S, an AI assistant specialized in creating accurate job estimates for beverage equipment projects.

Create a detailed job estimate that includes:
- Labor costs based on complexity and hours
- Equipment costs
- Materials and supplies
- Travel and logistics
- Contingency factors
- Total project cost breakdown

Be realistic and professional in your estimates.`

    const userPrompt = `Create a job estimate for:

Equipment: ${projectDetails.equipment}
Labor Hours: ${projectDetails.laborHours}
Complexity: ${projectDetails.complexity}
Location: ${projectDetails.location}
Special Requirements: ${projectDetails.specialRequirements.join(', ')}

Please provide a detailed cost breakdown with justification for each line item.`

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }

  async generateSafetyChecklist(equipment: string, location: string): Promise<string | null> {
    const systemPrompt = `You are A.R.E.S, an AI assistant specialized in safety protocols for beverage equipment installation and maintenance.

Create a comprehensive safety checklist that covers:
- Pre-work safety requirements
- During work safety protocols
- Post-work safety verification
- Emergency procedures
- Personal protective equipment
- Environmental considerations
- Equipment-specific safety requirements`

    const userPrompt = `Create a safety checklist for:

Equipment: ${equipment}
Location: ${location}

Include all necessary safety protocols and requirements specific to this equipment type and location.`

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }

  async generateInspectionReport(findings: string[]): Promise<string | null> {
    const systemPrompt = `You are A.R.E.S, an AI assistant specialized in creating professional inspection reports for beverage equipment.

Create a detailed inspection report that includes:
- Executive summary
- Detailed findings
- Recommendations
- Priority levels
- Cost estimates for repairs
- Timeline for addressing issues
- Compliance status`

    const userPrompt = `Create an inspection report based on these findings:

${findings.map((finding, index) => `${index + 1}. ${finding}`).join('\n')}

Please provide a professional report with clear recommendations and priorities.`

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }

  async generateWorkOrder(workDetails: {
    customer: string
    equipment: string
    issue: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    technician: string
  }): Promise<string | null> {
    const systemPrompt = `You are A.R.E.S, an AI assistant specialized in creating work orders for beverage equipment service.

Create a detailed work order that includes:
- Work order number and details
- Customer information
- Equipment information
- Problem description
- Required parts and tools
- Safety requirements
- Estimated duration
- Special instructions`

    const userPrompt = `Create a work order for:

Customer: ${workDetails.customer}
Equipment: ${workDetails.equipment}
Issue: ${workDetails.issue}
Priority: ${workDetails.priority}
Assigned Technician: ${workDetails.technician}

Please provide a comprehensive work order with all necessary details.`

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }
}

// Export singleton instance
export const azureOpenAI = new AzureOpenAIService()
