import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock, CheckCircle, Star, Zap, Trophy } from "lucide-react";
import { SkillTree as SkillTreeType, SkillNode, UserProgress } from "@/data/gamification";

interface SkillTreeProps {
  skillTree: SkillTreeType;
  userProgress: UserProgress;
  onNodeClick: (nodeId: string) => void;
}

interface SkillNodeProps {
  node: SkillNode;
  isUnlocked: boolean;
  isCompleted: boolean;
  userXP: number;
  onClick: () => void;
}

const SkillNodeComponent: React.FC<SkillNodeProps> = ({
  node,
  isUnlocked,
  isCompleted,
  userXP,
  onClick
}) => {
  const progressPercentage = isUnlocked ? Math.min((userXP / node.xpRequired) * 100, 100) : 0;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              absolute cursor-pointer transition-all duration-300 hover:scale-110
              ${isCompleted ? 'filter-none' : isUnlocked ? 'filter-none' : 'filter grayscale opacity-50'}
            `}
            style={{
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={onClick}
          >
            <div className="relative">
              {/* Node Circle */}
              <div
                className={`
                  w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl
                  transition-all duration-300
                  ${isCompleted 
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/50' 
                    : isUnlocked 
                    ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/50' 
                    : 'bg-gray-300 border-gray-400 text-gray-600'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-8 h-8" />
                ) : isUnlocked ? (
                  <span>{node.icon}</span>
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>
              
              {/* Progress Ring */}
              {isUnlocked && !isCompleted && (
                <div className="absolute inset-0 w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-gray-300"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${progressPercentage * 1.76} 176`}
                      className="text-yellow-400"
                    />
                  </svg>
                </div>
              )}
              
              {/* Level Badge */}
              <div className="absolute -top-2 -right-2">
                <Badge 
                  variant="secondary" 
                  className={`
                    text-xs px-1.5 py-0.5
                    ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}
                  `}
                >
                  {node.level}
                </Badge>
              </div>
            </div>
            
            {/* Node Label */}
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-gray-900 max-w-20 mx-auto leading-tight">
                {node.name}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-semibold">{node.name}</div>
            <div className="text-sm text-gray-600">{node.description}</div>
            <div className="flex items-center space-x-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>{node.xpRequired} XP required</span>
            </div>
            {node.prerequisites.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Prerequisites:</span>
                <div className="text-gray-600">
                  {node.prerequisites.join(', ')}
                </div>
              </div>
            )}
            {node.rewards.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Rewards:</span>
                <div className="space-y-1">
                  {node.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center space-x-1 text-gray-600">
                      <Trophy className="w-3 h-3" />
                      <span>{reward.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!isUnlocked && (
              <div className="text-sm text-red-600">
                Complete prerequisites to unlock
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const SkillTree: React.FC<SkillTreeProps> = ({ skillTree, userProgress, onNodeClick }) => {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  
  const isNodeUnlocked = (node: SkillNode): boolean => {
    if (node.prerequisites.length === 0) return true;
    return node.prerequisites.every(prereq => 
      skillTree.nodes.some(n => n.id === prereq && userProgress.chaptersCompleted.includes(n.id))
    );
  };
  
  const isNodeCompleted = (node: SkillNode): boolean => {
    return userProgress.chaptersCompleted.includes(node.id);
  };
  
  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
    onNodeClick(node.id);
  };
  
  // Calculate tree dimensions
  const maxX = Math.max(...skillTree.nodes.map(n => n.position.x)) + 100;
  const maxY = Math.max(...skillTree.nodes.map(n => n.position.y)) + 100;
  
  return (
    <div className="space-y-6">
      {/* Skill Tree Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span>{skillTree.name}</span>
              </CardTitle>
              <CardDescription>{skillTree.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="text-2xl font-bold text-blue-600">
                {skillTree.nodes.filter(n => isNodeCompleted(n)).length}/{skillTree.nodes.length}
              </div>
            </div>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Skill Tree Progress</span>
              <span>
                {Math.round((skillTree.nodes.filter(n => isNodeCompleted(n)).length / skillTree.nodes.length) * 100)}%
              </span>
            </div>
            <Progress 
              value={(skillTree.nodes.filter(n => isNodeCompleted(n)).length / skillTree.nodes.length) * 100}
              className="h-2"
            />
          </div>
        </CardHeader>
      </Card>
      
      {/* Skill Tree Visualization */}
      <Card>
        <CardContent className="p-6">
          <div 
            className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300 overflow-auto"
            style={{ width: '100%', height: '500px' }}
          >
            <div 
              className="relative"
              style={{ width: `${maxX}px`, height: `${maxY}px`, minWidth: '100%', minHeight: '100%' }}
            >
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {skillTree.nodes.map(node => 
                  node.unlocks.map(unlockId => {
                    const unlockNode = skillTree.nodes.find(n => n.id === unlockId);
                    if (!unlockNode) return null;
                    
                    const isConnectionActive = isNodeCompleted(node) || isNodeUnlocked(unlockNode);
                    
                    return (
                      <line
                        key={`${node.id}-${unlockId}`}
                        x1={node.position.x}
                        y1={node.position.y}
                        x2={unlockNode.position.x}
                        y2={unlockNode.position.y}
                        stroke={isConnectionActive ? "#3b82f6" : "#d1d5db"}
                        strokeWidth="2"
                        strokeDasharray={isConnectionActive ? "none" : "5,5"}
                        className="transition-all duration-300"
                      />
                    );
                  })
                )}
              </svg>
              
              {/* Skill Nodes */}
              {skillTree.nodes.map(node => (
                <SkillNodeComponent
                  key={node.id}
                  node={node}
                  isUnlocked={isNodeUnlocked(node)}
                  isCompleted={isNodeCompleted(node)}
                  userXP={userProgress.totalXP}
                  onClick={() => handleNodeClick(node)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Node Details */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">{selectedNode.icon}</span>
              <span>{selectedNode.name}</span>
            </CardTitle>
            <CardDescription>{selectedNode.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">Level</div>
                <div className="text-lg font-bold">{selectedNode.level}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">XP Required</div>
                <div className="text-lg font-bold">{selectedNode.xpRequired}</div>
              </div>
            </div>
            
            {selectedNode.rewards.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Rewards</div>
                <div className="space-y-1">
                  {selectedNode.rewards.map((reward, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {reward.value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                disabled={!isNodeUnlocked(selectedNode) || isNodeCompleted(selectedNode)}
                className="flex-1"
              >
                {isNodeCompleted(selectedNode) ? 'Completed' : 'Start Learning'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillTree;
