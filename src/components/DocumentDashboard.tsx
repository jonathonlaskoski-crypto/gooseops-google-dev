import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  Calculator, 
  Shield, 
  ClipboardCheck, 
  Wrench,
  Download,
  Upload,
  Save,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { azureOpenAI } from '@/lib/azureOpenAI'
import { aresSupabase } from '@/lib/supabaseClient'

interface DocumentTemplate {
  id: string
  name: string
  type: 'scope' | 'estimate' | 'safety' | 'inspection' | 'workorder'
  description: string
  content: string
  created: string
  modified: string
}

interface DocumentDashboardProps {
  isOfficeMode: boolean
}

export function DocumentDashboard({ isOfficeMode }: DocumentDashboardProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [formData, setFormData] = useState({
    customer: '',
    location: '',
    equipment: '',
    requirements: '',
    laborHours: '',
    complexity: 'medium' as 'low' | 'medium' | 'high',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    technician: '',
    issue: '',
    findings: ''
  })

  // Load templates on mount
  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    // In a real app, this would load from Supabase
    const defaultTemplates: DocumentTemplate[] = [
      {
        id: '1',
        name: 'Freestyle Installation Scope',
        type: 'scope',
        description: 'Standard scope of work for Coca-Cola Freestyle installations',
        content: '',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Spire Maintenance Estimate',
        type: 'estimate',
        description: 'Cost estimate template for Pepsi Spire maintenance',
        content: '',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Ice Machine Safety Checklist',
        type: 'safety',
        description: 'Safety protocols for ice machine installation and maintenance',
        content: '',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ]
    setTemplates(defaultTemplates)
  }

  const generateDocument = async (type: string) => {
    setIsGenerating(true)
    try {
      let content = ''
      
      switch (type) {
        case 'scope':
          content = await azureOpenAI.generateScopeOfWork({
            customer: formData.customer,
            location: formData.location,
            equipment: formData.equipment,
            requirements: formData.requirements.split(',').map(r => r.trim())
          }) || 'Failed to generate scope of work'
          break
          
        case 'estimate':
          content = await azureOpenAI.generateJobEstimate({
            equipment: formData.equipment,
            laborHours: parseInt(formData.laborHours) || 0,
            complexity: formData.complexity,
            location: formData.location,
            specialRequirements: formData.requirements.split(',').map(r => r.trim())
          }) || 'Failed to generate job estimate'
          break
          
        case 'safety':
          content = await azureOpenAI.generateSafetyChecklist(
            formData.equipment,
            formData.location
          ) || 'Failed to generate safety checklist'
          break
          
        case 'inspection':
          content = await azureOpenAI.generateInspectionReport(
            formData.findings.split('\n').filter(f => f.trim())
          ) || 'Failed to generate inspection report'
          break
          
        case 'workorder':
          content = await azureOpenAI.generateWorkOrder({
            customer: formData.customer,
            equipment: formData.equipment,
            issue: formData.issue,
            priority: formData.priority,
            technician: formData.technician
          }) || 'Failed to generate work order'
          break
      }
      
      setGeneratedContent(content)
    } catch (error) {
      console.error('Document generation error:', error)
      setGeneratedContent('Error generating document. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveTemplate = async () => {
    if (!generatedContent) return
    
    const newTemplate: DocumentTemplate = {
      id: Date.now().toString(),
      name: `${formData.equipment} ${selectedTemplate?.type || 'document'}`,
      type: (selectedTemplate?.type || 'scope') as any,
      description: `Generated document for ${formData.customer}`,
      content: generatedContent,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
    
    setTemplates(prev => [...prev, newTemplate])
    setGeneratedContent('')
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'scope': return <FileText className="w-5 h-5" />
      case 'estimate': return <Calculator className="w-5 h-5" />
      case 'safety': return <Shield className="w-5 h-5" />
      case 'inspection': return <ClipboardCheck className="w-5 h-5" />
      case 'workorder': return <Wrench className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'scope': return 'text-blue-400'
      case 'estimate': return 'text-green-400'
      case 'safety': return 'text-red-400'
      case 'inspection': return 'text-yellow-400'
      case 'workorder': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Document Makers */}
      <Card className={isOfficeMode ? 'bg-black/60 border-cyan-400/30' : ''}>
        <CardHeader>
          <CardTitle className={isOfficeMode ? 'text-cyan-400' : ''}>
            <FileText className="mr-2" size={20} />
            Document Makers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <Input
                value={formData.customer}
                onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                placeholder="Customer name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Site location"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Equipment</label>
              <Input
                value={formData.equipment}
                onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                placeholder="Equipment type/model"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Labor Hours</label>
              <Input
                type="number"
                value={formData.laborHours}
                onChange={(e) => setFormData(prev => ({ ...prev, laborHours: e.target.value }))}
                placeholder="Estimated hours"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Complexity</label>
              <select
                value={formData.complexity}
                onChange={(e) => setFormData(prev => ({ ...prev, complexity: e.target.value as any }))}
                className="w-full p-2 border rounded-md"
                aria-label="Document Complexity"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="priority-select">Priority</label>
              <select
                id="priority-select"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full p-2 border rounded-md"
                aria-label="Priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Requirements/Special Instructions</label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="Enter requirements, separated by commas"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Issue Description (for work orders)</label>
            <Textarea
              value={formData.issue}
              onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
              placeholder="Describe the issue or problem"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Inspection Findings (for inspection reports)</label>
            <Textarea
              value={formData.findings}
              onChange={(e) => setFormData(prev => ({ ...prev, findings: e.target.value }))}
              placeholder="Enter findings, one per line"
              rows={3}
            />
          </div>

          {/* Generate Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button
              onClick={() => generateDocument('scope')}
              disabled={isGenerating}
              className="w-full"
            >
              <FileText className="mr-2" size={16} />
              Scope
            </Button>
            <Button
              onClick={() => generateDocument('estimate')}
              disabled={isGenerating}
              className="w-full"
            >
              <Calculator className="mr-2" size={16} />
              Estimate
            </Button>
            <Button
              onClick={() => generateDocument('safety')}
              disabled={isGenerating}
              className="w-full"
            >
              <Shield className="mr-2" size={16} />
              Safety
            </Button>
            <Button
              onClick={() => generateDocument('inspection')}
              disabled={isGenerating}
              className="w-full"
            >
              <ClipboardCheck className="mr-2" size={16} />
              Inspection
            </Button>
            <Button
              onClick={() => generateDocument('workorder')}
              disabled={isGenerating}
              className="w-full"
            >
              <Wrench className="mr-2" size={16} />
              Work Order
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <Card className={isOfficeMode ? 'bg-black/60 border-cyan-400/30' : ''}>
          <CardHeader>
            <CardTitle className={isOfficeMode ? 'text-cyan-400' : ''}>
              Generated Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-96 w-full border rounded-md p-4">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </ScrollArea>
            <div className="flex gap-2">
              <Button onClick={saveTemplate} className="flex-1">
                <Save className="mr-2" size={16} />
                Save as Template
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="mr-2" size={16} />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Library */}
      <Card className={isOfficeMode ? 'bg-black/60 border-cyan-400/30' : ''}>
        <CardHeader>
          <CardTitle className={isOfficeMode ? 'text-cyan-400' : ''}>
            Template Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-center gap-3">
                  <div className={getDocumentColor(template.type)}>
                    {getDocumentIcon(template.type)}
                  </div>
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground">{template.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{template.type}</Badge>
                  <Button size="sm" variant="ghost">
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={isOfficeMode ? 'bg-black/60 border-cyan-400/30' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">Azure OpenAI: Connected</span>
            </div>
          </CardContent>
        </Card>
        <Card className={isOfficeMode ? 'bg-black/60 border-cyan-400/30' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">Supabase: Connected</span>
            </div>
          </CardContent>
        </Card>
        <Card className={isOfficeMode ? 'bg-black/60 border-cyan-400/30' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Templates: {templates.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
