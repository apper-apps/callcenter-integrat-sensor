const mockConversations = [
  {
    Id: 1,
    title: "Agent Performance Analytics",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:45:00Z",
    messages: [
      {
        Id: 1,
        content: "Hello! I'm your AI assistant. How can I help you with your call center operations today?",
        sender: "ai",
        timestamp: "2024-01-15T10:30:00Z"
      },
      {
        Id: 2,
        content: "Can you help me understand agent performance metrics?",
        sender: "user",
        timestamp: "2024-01-15T10:32:00Z"
      },
      {
        Id: 3,
        content: "Absolutely! Agent performance metrics are crucial for optimizing your call center operations. I can help you track key indicators like average handle time, first call resolution rate, customer satisfaction scores, and agent utilization. Would you like me to show you current agent metrics or help you set up performance dashboards?",
        sender: "ai",
        timestamp: "2024-01-15T10:32:30Z"
      },
      {
        Id: 4,
        content: "Show me current agent metrics please",
        sender: "user",
        timestamp: "2024-01-15T10:35:00Z"
      },
      {
        Id: 5,
        content: "I can guide you to view your current agent metrics! Navigate to the Agents section in your main menu, where you'll find real-time performance data including agent availability, call volumes, and efficiency ratings. You can also access detailed analytics from the Analytics dashboard for historical performance trends and comparative analysis.",
        sender: "ai",
        timestamp: "2024-01-15T10:35:30Z"
      }
    ]
  },
  {
    Id: 2,
    title: "Queue Management Setup",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:35:00Z",
    messages: [
      {
        Id: 6,
        content: "Hello! I'm your AI assistant. How can I help you with your call center operations today?",
        sender: "ai",
        timestamp: "2024-01-14T14:20:00Z"
      },
      {
        Id: 7,
        content: "I need help setting up queue priorities",
        sender: "user",
        timestamp: "2024-01-14T14:22:00Z"
      },
      {
        Id: 8,
        content: "Queue prioritization is essential for efficient call routing! I can help you configure priority levels based on customer types, call urgency, or service levels. You can set up high-priority queues for VIP customers, medium priority for standard calls, and low priority for callback requests. Would you like me to guide you through the queue configuration process?",
        sender: "ai",
        timestamp: "2024-01-14T14:22:30Z"
      },
      {
        Id: 9,
        content: "Yes, please guide me through the process",
        sender: "user",
        timestamp: "2024-01-14T14:25:00Z"
      },
      {
        Id: 10,
        content: "Great! Here's how to set up queue priorities: 1) Go to the Queue Monitor section, 2) Select 'Configure Queues' or use the settings icon, 3) Choose your queue and set priority levels (High/Medium/Low), 4) Define routing rules based on your criteria, 5) Set SLA targets for each priority level. This ensures high-priority calls get immediate attention while maintaining efficient overall operations.",
        sender: "ai",
        timestamp: "2024-01-14T14:25:30Z"
      }
    ]
  },
  {
    Id: 3,
    title: "System Configuration Help",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:25:00Z",
    messages: [
      {
        Id: 11,
        content: "Hello! I'm your AI assistant. How can I help you with your call center operations today?",
        sender: "ai",
        timestamp: "2024-01-13T09:15:00Z"
      },
      {
        Id: 12,
        content: "How do I configure notification settings?",
        sender: "user",
        timestamp: "2024-01-13T09:17:00Z"
      },
      {
        Id: 13,
        content: "I can help you configure notification settings! Go to the Settings section where you can customize alerts for queue thresholds, agent status changes, system alerts, and performance notifications. You can set up email notifications, in-app alerts, or SMS alerts based on your preferences. Would you like me to walk you through specific notification types?",
        sender: "ai",
        timestamp: "2024-01-13T09:17:30Z"
      }
    ]
  }
]

export default mockConversations