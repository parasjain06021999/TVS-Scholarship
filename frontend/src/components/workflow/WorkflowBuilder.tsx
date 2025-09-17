'use client';

import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'assignment' | 'condition' | 'delay';
  config: any;
  position: { x: number; y: number };
}

interface WorkflowBuilderProps {
  onSave: (workflow: any) => void;
  initialWorkflow?: any;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ onSave, initialWorkflow }) => {
  const [workflow, setWorkflow] = useState({
    name: initialWorkflow?.name || '',
    description: initialWorkflow?.description || '',
    steps: initialWorkflow?.steps || [],
  });

  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const stepTypes = [
    { id: 'approval', name: 'Approval', icon: '✓', color: 'bg-green-500' },
    { id: 'notification', name: 'Notification', icon: '🔔', color: 'bg-blue-500' },
    { id: 'assignment', name: 'Assignment', icon: '👤', color: 'bg-purple-500' },
    { id: 'condition', name: 'Condition', icon: '❓', color: 'bg-yellow-500' },
    { id: 'delay', name: 'Delay', icon: '⏰', color: 'bg-gray-500' },
  ];

  const addStep = (type: string) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: `New ${type}`,
      type: type as any,
      config: {},
      position: { x: 100, y: 100 + workflow.steps.length * 150 },
    };

    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map((step: any) =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    }));
  };

  const deleteStep = (stepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter((step: any) => step.id !== stepId),
    }));
    setSelectedStep(null);
  };

  const handleSave = () => {
    onSave(workflow);
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(st => st.id === type);
    return stepType?.icon || '?';
  };

  const getStepColor = (type: string) => {
    const stepType = stepTypes.find(st => st.id === type);
    return stepType?.color || 'bg-gray-500';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Workflow Builder</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Workflow Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Name
            </label>
            <input
              type="text"
              value={workflow.name}
              onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter workflow name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={workflow.description}
              onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter workflow description"
            />
          </div>

          {/* Step Types */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Add Step</h3>
            <div className="space-y-2">
              {stepTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => addStep(type.id)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <span className={`w-6 h-6 rounded-full ${type.color} flex items-center justify-center text-white text-xs`}>
                    {type.icon}
                  </span>
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-50">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Workflow Steps */}
          <div className="relative">
            {workflow.steps.map((step: any, index: number) => (
              <div
                key={step.id}
                className={`absolute w-48 p-4 bg-white rounded-lg shadow-md border-2 cursor-pointer ${
                  selectedStep?.id === step.id ? 'border-blue-500' : 'border-gray-200'
                }`}
                style={{
                  left: step.position.x,
                  top: step.position.y,
                }}
                onClick={() => setSelectedStep(step)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-full ${getStepColor(step.type)} flex items-center justify-center text-white text-sm`}>
                    {getStepIcon(step.type)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStep(step.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-1">{step.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{step.type}</p>
                
                {/* Connection Line */}
                {index < workflow.steps.length - 1 && (
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                    <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Configuration Panel */}
      {selectedStep && (
        <div className="w-80 bg-white shadow-lg border-l">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Step Configuration</h3>
              <button
                onClick={() => setSelectedStep(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Step Name
              </label>
              <input
                type="text"
                value={selectedStep.name}
                onChange={(e) => {
                  const updatedStep = { ...selectedStep, name: e.target.value };
                  setSelectedStep(updatedStep);
                  updateStep(selectedStep.id, { name: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Step-specific configuration */}
            {selectedStep.type === 'approval' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approver Role
                </label>
                <select
                  value={selectedStep.config.approverRole || ''}
                  onChange={(e) => {
                    const updatedStep = {
                      ...selectedStep,
                      config: { ...selectedStep.config, approverRole: e.target.value }
                    };
                    setSelectedStep(updatedStep);
                    updateStep(selectedStep.id, { config: updatedStep.config });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="FINANCE_OFFICER">Finance Officer</option>
                </select>
              </div>
            )}

            {selectedStep.type === 'notification' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <select
                  value={selectedStep.config.notificationType || ''}
                  onChange={(e) => {
                    const updatedStep = {
                      ...selectedStep,
                      config: { ...selectedStep.config, notificationType: e.target.value }
                    };
                    setSelectedStep(updatedStep);
                    updateStep(selectedStep.id, { config: updatedStep.config });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="PUSH">Push Notification</option>
                </select>
              </div>
            )}

            {selectedStep.type === 'assignment' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  value={selectedStep.config.assignTo || ''}
                  onChange={(e) => {
                    const updatedStep = {
                      ...selectedStep,
                      config: { ...selectedStep.config, assignTo: e.target.value }
                    };
                    setSelectedStep(updatedStep);
                    updateStep(selectedStep.id, { config: updatedStep.config });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select User</option>
                  <option value="AUTO">Auto Assign</option>
                  <option value="ROUND_ROBIN">Round Robin</option>
                  <option value="LEAST_LOADED">Least Loaded</option>
                </select>
              </div>
            )}

            {selectedStep.type === 'delay' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delay Duration (hours)
                </label>
                <input
                  type="number"
                  value={selectedStep.config.duration || ''}
                  onChange={(e) => {
                    const updatedStep = {
                      ...selectedStep,
                      config: { ...selectedStep.config, duration: parseInt(e.target.value) }
                    };
                    setSelectedStep(updatedStep);
                    updateStep(selectedStep.id, { config: updatedStep.config });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
