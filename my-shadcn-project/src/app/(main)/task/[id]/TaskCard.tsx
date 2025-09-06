import React from 'react';
import { Calendar, User, Users, Clock, Edit3, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const TaskCard = ({task}) => {
  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format datetime helper function
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'default';
      case 'closed':
        return 'secondary';
      case 'in_progress':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Person card component
  const PersonCard = ({ person }) => (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{person.full_name}</span>
        </div>
        <div className="text-sm text-muted-foreground">{person.email}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        {/* Header with Edit Button */}
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{task.title}</CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant={getStatusVariant(task.status)} className="gap-1">
                  {task.status === 'open' && <AlertCircle className="w-4 h-4" />}
                  {task.status === 'closed' && <CheckCircle className="w-4 h-4" />}
                  {task.status?.charAt(0).toUpperCase() + task.status?.slice(1).replace('_', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground">ID: {task.id}</span>
              </div>
            </div>
            <Button  className="gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Task
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground leading-relaxed">
                  {task.description || 'No description provided'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Date Information - Single Row */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Timeline</h3>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="font-medium text-sm">Due Date</span>
                      <p className="text-sm text-muted-foreground">{formatDate(task.due_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    <div>
                      <span className="font-medium text-sm">Created</span>
                      <p className="text-sm text-muted-foreground">{formatDateTime(task.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <div>
                      <span className="font-medium text-sm">Updated</span>
                      <p className="text-sm text-muted-foreground">{formatDateTime(task.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Owner */}
          {task.owner_details && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Task Owner
              </h3>
              <div className="max-w-sm">
                <PersonCard person={task.owner_details} />
              </div>
            </div>
          )}

          {/* Assignees */}
          {task.assignees_details && task.assignees_details.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Assignees ({task.assignees_details.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {task.assignees_details.map((assignee) => (
                  <PersonCard key={assignee.id} person={assignee} />
                ))}
              </div>
            </div>
          )}

          {/* Supporting Staff */}
          {task.supporting_staff_details && task.supporting_staff_details.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Supporting Staff ({task.supporting_staff_details.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {task.supporting_staff_details.map((staff) => (
                  <PersonCard key={staff.id} person={staff} />
                ))}
              </div>
            </div>
          )}

          {/* Actions Required */}
          {task.actions_required && task.actions_required.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Actions Required</h3>
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <ul className="list-disc list-inside space-y-1">
                    {task.actions_required.map((action, index) => (
                      <li key={index} className="text-amber-800">{action}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Additional Info */}
          {task.closed_at && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Task Closed</span>
                </div>
                <span className="text-green-800 text-sm">{formatDateTime(task.closed_at)}</span>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Example usage component
const ExampleUsage = () => {
  const sampleTask = {
    "id": 21,
    "assignees_details": [
      {
        "id": 1,
        "email": "john.doe@example.com",
        "full_name": "John  Doe"
      },
      {
        "id": 6,
        "email": "emily.davis_alt@example.com",
        "full_name": "Emily  Davis"
      },
      {
        "id": 11,
        "email": "ryan.anderson_alt@example.com",
        "full_name": "Ryan  Anderson"
      },
      {
        "id": 16,
        "email": "elizabeth.martin_alt@example.com",
        "full_name": "Elizabeth  Martin"
      },
      {
        "id": 21,
        "email": "scott.hernandez_alt@example.com",
        "full_name": "Scott  Hernandez"
      }
    ],
    "supporting_staff_details": [
      {
        "id": 6,
        "email": "emily.davis_alt@example.com",
        "full_name": "Emily  Davis"
      },
      {
        "id": 16,
        "email": "elizabeth.martin_alt@example.com",
        "full_name": "Elizabeth  Martin"
      }
    ],
    "owner_details": {
      "id": 51,
      "email": "sonabateshar1999@gmail.com",
      "full_name": "Sona  Batesar"
    },
    "title": "sfghfsgjdgj",
    "description": "madjlhgfjadkltherio;gmndm,gnfd aeri nk na fjl; mxcclkvho; asdlkk lk;j dslk fslkf dslf hweopfjkfhasd",
    "actions_required": [],
    "status": "open",
    "created_at": "2025-09-03T09:05:30.107871Z",
    "updated_at": "2025-09-03T09:05:30.107898Z",
    "due_date": "2025-09-10",
    "closed_at": null,
    "discarted": false,
    "owner": 51,
    "assignees": [1, 6, 11, 16, 21],
    "supporting_staff": [6, 16]
  };

  const handleEdit = () => {
    alert('Edit button clicked! You would navigate to edit mode here.');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <TaskDisplay task={sampleTask} onEdit={handleEdit} />
    </div>
  );
};

export default ExampleUsage;