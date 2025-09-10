import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Clock, Target, CheckCircle, Circle, Edit2, Trash2, Play, RotateCcw } from 'lucide-react';

const StudyBuddy = () => {
  const [topics, setTopics] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [activeTab, setActiveTab] = useState('topics');
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  // Japanese study technique intervals (in days)
  const spacedRepetitionIntervals = [1, 3, 7, 14, 30, 90];

  const [newTopic, setNewTopic] = useState({
    title: '',
    subtopics: [''],
    complexity: 'medium',
    priority: 'medium',
    estimatedHours: 2
  });

  const complexityOptions = {
    easy: { multiplier: 0.5, color: '#dcfce7', textColor: '#166534' },
    medium: { multiplier: 1, color: '#fef3c7', textColor: '#92400e' },
    hard: { multiplier: 2, color: '#fee2e2', textColor: '#991b1b' }
  };

  const priorityOptions = {
    low: { weight: 1, color: '#dbeafe', textColor: '#1e40af' },
    medium: { weight: 2, color: '#e9d5ff', textColor: '#7c2d12' },
    high: { weight: 3, color: '#fed7aa', textColor: '#ea580c' }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '24px'
    },
    headerCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: 0
    },
    subtitle: {
      color: '#6b7280',
      marginTop: '8px',
      fontSize: '16px'
    },
    tabContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '4px',
      marginBottom: '24px'
    },
    tabs: {
      display: 'flex',
      gap: '4px'
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none',
      backgroundColor: 'transparent'
    },
    activeTab: {
      backgroundColor: '#4f46e5',
      color: 'white'
    },
    inactiveTab: {
      color: '#6b7280'
    },
    button: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    buttonSecondary: {
      backgroundColor: '#d1d5db',
      color: '#374151',
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      backgroundColor: 'white'
    },
    grid: {
      display: 'grid',
      gap: '16px'
    },
    gridCols2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px'
    },
    flexRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500'
    },
    emptyState: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '48px',
      textAlign: 'center'
    },
    progressBar: {
      width: '128px',
      backgroundColor: '#e5e7eb',
      borderRadius: '10px',
      height: '8px',
      marginTop: '8px'
    },
    progressFill: {
      height: '8px',
      borderRadius: '10px',
      backgroundColor: '#4f46e5',
      transition: 'width 0.3s'
    },
    taskCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      transition: 'all 0.2s'
    },
    completedTask: {
      opacity: 0.75
    },
    iconButton: {
      color: '#6b7280',
      cursor: 'pointer',
      padding: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '4px',
      transition: 'color 0.2s'
    }
  };

  const addSubtopic = () => {
    setNewTopic(prev => ({
      ...prev,
      subtopics: [...prev.subtopics, '']
    }));
  };

  const updateSubtopic = (index, value) => {
    setNewTopic(prev => ({
      ...prev,
      subtopics: prev.subtopics.map((subtopic, i) => i === index ? value : subtopic)
    }));
  };

  const removeSubtopic = (index) => {
    setNewTopic(prev => ({
      ...prev,
      subtopics: prev.subtopics.filter((_, i) => i !== index)
    }));
  };

  const generateStudyPlan = () => {
    const plan = [];
    const today = new Date();
    
    topics.forEach((topic, topicIndex) => {
      const complexity = complexityOptions[topic.complexity];
      const priority = priorityOptions[topic.priority];
      
      const timePerSubtopic = (topic.estimatedHours / topic.subtopics.length) * complexity.multiplier;
      
      topic.subtopics.forEach((subtopic, subtopicIndex) => {
        if (subtopic.trim()) {
          const initialDate = new Date(today);
          initialDate.setDate(today.getDate() + (topicIndex * 2) + subtopicIndex);
          
          plan.push({
            id: `${topicIndex}-${subtopicIndex}-initial`,
            topic: topic.title,
            subtopic: subtopic,
            type: 'Initial Learning',
            date: initialDate.toDateString(),
            duration: Math.ceil(timePerSubtopic * 60),
            completed: false,
            priority: topic.priority,
            complexity: topic.complexity,
            reviewCount: 0
          });

          spacedRepetitionIntervals.forEach((interval, reviewIndex) => {
            const reviewDate = new Date(initialDate);
            reviewDate.setDate(initialDate.getDate() + interval);
            
            plan.push({
              id: `${topicIndex}-${subtopicIndex}-review-${reviewIndex}`,
              topic: topic.title,
              subtopic: subtopic,
              type: `Review ${reviewIndex + 1}`,
              date: reviewDate.toDateString(),
              duration: Math.ceil(timePerSubtopic * 30),
              completed: false,
              priority: topic.priority,
              complexity: topic.complexity,
              reviewCount: reviewIndex + 1
            });
          });

          const testDate = new Date(initialDate);
          testDate.setDate(initialDate.getDate() + 2);
          
          plan.push({
            id: `${topicIndex}-${subtopicIndex}-test`,
            topic: topic.title,
            subtopic: subtopic,
            type: 'Active Recall Test',
            date: testDate.toDateString(),
            duration: 15,
            completed: false,
            priority: topic.priority,
            complexity: topic.complexity,
            reviewCount: 0
          });
        }
      });
    });

    plan.sort((a, b) => {
      const priorityA = priorityOptions[a.priority].weight;
      const priorityB = priorityOptions[b.priority].weight;
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      return new Date(a.date) - new Date(b.date);
    });

    setStudyPlan(plan);
    setActiveTab('plan');
  };

  const addTopic = () => {
    if (newTopic.title.trim()) {
      const topic = {
        id: Date.now(),
        ...newTopic,
        subtopics: newTopic.subtopics.filter(s => s.trim()),
        dateAdded: new Date().toDateString()
      };
      
      setTopics(prev => [...prev, topic]);
      setNewTopic({
        title: '',
        subtopics: [''],
        complexity: 'medium',
        priority: 'medium',
        estimatedHours: 2
      });
      setShowAddTopic(false);
    }
  };

  const editTopic = (topic) => {
    setEditingTopic(topic.id);
    setNewTopic(topic);
    setShowAddTopic(true);
  };

  const updateTopic = () => {
    setTopics(prev => prev.map(topic => 
      topic.id === editingTopic 
        ? { ...newTopic, id: editingTopic, dateAdded: topic.dateAdded }
        : topic
    ));
    setEditingTopic(null);
    setShowAddTopic(false);
    setNewTopic({
      title: '',
      subtopics: [''],
      complexity: 'medium',
      priority: 'medium',
      estimatedHours: 2
    });
  };

  const deleteTopic = (id) => {
    setTopics(prev => prev.filter(topic => topic.id !== id));
  };

  const toggleTaskCompletion = (taskId) => {
    setStudyPlan(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getProgressStats = () => {
    const completed = studyPlan.filter(task => task.completed).length;
    const total = studyPlan.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const getTodaysTasks = () => {
    const today = new Date().toDateString();
    return studyPlan.filter(task => task.date === today);
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    return studyPlan.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate > today;
    }).slice(0, 5);
  };

  const stats = getProgressStats();
  const todaysTasks = getTodaysTasks();
  const upcomingTasks = getUpcomingTasks();

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.headerCard}>
          <div>
            <h1 style={styles.title}>
              <BookOpen color="#4f46e5" />
              Study Buddy
            </h1>
            <p style={styles.subtitle}>Personalized study planner with Japanese learning techniques</p>
          </div>
          {stats.total > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>
                {stats.percentage}%
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {stats.completed}/{stats.total} completed
              </div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${stats.percentage}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div style={styles.tabContainer}>
          <div style={styles.tabs}>
            {[
              { id: 'topics', label: 'Topics', icon: BookOpen },
              { id: 'plan', label: 'Study Plan', icon: Clock },
              { id: 'today', label: 'Today', icon: Target }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.activeTab : styles.inactiveTab)
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <div>
            <div style={styles.flexBetween}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Study Topics
              </h2>
              <button onClick={() => setShowAddTopic(true)} style={styles.button}>
                <Plus size={18} />
                Add Topic
              </button>
            </div>

            {/* Add/Edit Topic Form */}
            {showAddTopic && (
              <div style={{ ...styles.card, border: '2px solid #c7d2fe', marginTop: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                  {editingTopic ? 'Edit Topic' : 'Add New Topic'}
                </h3>
                
                <div style={styles.gridCols2}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Topic Title
                    </label>
                    <input
                      type="text"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                      style={styles.input}
                      placeholder="Enter topic title"
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      value={newTopic.estimatedHours}
                      onChange={(e) => setNewTopic(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 2 }))}
                      style={styles.input}
                      min="1"
                      max="20"
                    />
                  </div>
                </div>

                <div style={{ ...styles.gridCols2, marginTop: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Complexity
                    </label>
                    <select
                      value={newTopic.complexity}
                      onChange={(e) => setNewTopic(prev => ({ ...prev, complexity: e.target.value }))}
                      style={styles.select}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Priority
                    </label>
                    <select
                      value={newTopic.priority}
                      onChange={(e) => setNewTopic(prev => ({ ...prev, priority: e.target.value }))}
                      style={styles.select}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Subtopics
                  </label>
                  {newTopic.subtopics.map((subtopic, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        value={subtopic}
                        onChange={(e) => updateSubtopic(index, e.target.value)}
                        style={{ ...styles.input, flex: 1 }}
                        placeholder={`Subtopic ${index + 1}`}
                      />
                      {newTopic.subtopics.length > 1 && (
                        <button
                          onClick={() => removeSubtopic(index)}
                          style={{ ...styles.iconButton, color: '#dc2626' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addSubtopic}
                    style={{ 
                      color: '#4f46e5', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Plus size={16} />
                    Add Subtopic
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    onClick={editingTopic ? updateTopic : addTopic}
                    style={styles.button}
                  >
                    {editingTopic ? 'Update Topic' : 'Add Topic'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddTopic(false);
                      setEditingTopic(null);
                      setNewTopic({
                        title: '',
                        subtopics: [''],
                        complexity: 'medium',
                        priority: 'medium',
                        estimatedHours: 2
                      });
                    }}
                    style={styles.buttonSecondary}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Topics List */}
            <div style={{ ...styles.grid, marginTop: '24px' }}>
              {topics.map(topic => (
                <div key={topic.id} style={styles.taskCard}>
                  <div style={styles.flexBetween}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {topic.title}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                        Added on {topic.dateAdded}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: complexityOptions[topic.complexity].color,
                        color: complexityOptions[topic.complexity].textColor
                      }}>
                        {topic.complexity}
                      </span>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: priorityOptions[topic.priority].color,
                        color: priorityOptions[topic.priority].textColor
                      }}>
                        {topic.priority} priority
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      Subtopics ({topic.subtopics.length}):
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {topic.subtopics.map((subtopic, index) => (
                        <span key={index} style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '14px'
                        }}>
                          {subtopic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ ...styles.flexBetween, marginTop: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={16} />
                      {topic.estimatedHours} hours estimated
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editTopic(topic)} style={{ ...styles.iconButton, color: '#2563eb' }}>
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteTopic(topic.id)} style={{ ...styles.iconButton, color: '#dc2626' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {topics.length === 0 && !showAddTopic && (
                <div style={styles.emptyState}>
                  <BookOpen size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                    No topics yet
                  </h3>
                  <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                    Add your first study topic to get started
                  </p>
                  <button onClick={() => setShowAddTopic(true)} style={styles.button}>
                    Add Your First Topic
                  </button>
                </div>
              )}
            </div>

            {topics.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button
                  onClick={generateStudyPlan}
                  style={{
                    ...styles.button,
                    backgroundColor: '#059669',
                    fontSize: '16px',
                    padding: '16px 32px'
                  }}
                >
                  <Target size={20} />
                  Generate Study Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Study Plan Tab */}
        {activeTab === 'plan' && (
          <div>
            <div style={styles.flexBetween}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Study Plan
              </h2>
              {studyPlan.length > 0 && (
                <button onClick={generateStudyPlan} style={styles.button}>
                  <RotateCcw size={18} />
                  Regenerate Plan
                </button>
              )}
            </div>

            {studyPlan.length > 0 ? (
              <div style={{ ...styles.grid, marginTop: '24px' }}>
                {studyPlan.map(task => (
                  <div key={task.id} style={{
                    ...styles.taskCard,
                    ...(task.completed ? styles.completedTask : {})
                  }}>
                    <div style={styles.flexBetween}>
                      <div style={{ flex: 1 }}>
                        <div style={styles.flexRow}>
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            style={{
                              ...styles.iconButton,
                              color: task.completed ? '#059669' : '#9ca3af'
                            }}
                          >
                            {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                          </button>
                          <div>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: task.completed ? '#6b7280' : '#1f2937',
                              textDecoration: task.completed ? 'line-through' : 'none',
                              margin: 0
                            }}>
                              {task.topic} - {task.subtopic}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                              {task.type}
                            </p>
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          fontSize: '14px',
                          color: '#6b7280',
                          marginLeft: '36px',
                          marginTop: '8px'
                        }}>
                          <span style={styles.flexRow}>
                            <Clock size={16} />
                            {task.duration} mins
                          </span>
                          <span>Due: {task.date}</span>
                          {task.reviewCount > 0 && (
                            <span style={{
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              padding: '4px 8px',
                              borderRadius: '20px',
                              fontSize: '12px'
                            }}>
                              Review #{task.reviewCount}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: complexityOptions[task.complexity].color,
                          color: complexityOptions[task.complexity].textColor
                        }}>
                          {task.complexity}
                        </span>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: priorityOptions[task.priority].color,
                          color: priorityOptions[task.priority].textColor
                        }}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ ...styles.emptyState, marginTop: '24px' }}>
                <Target size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                  No study plan yet
                </h3>
                <p style={{ color: '#9ca3af' }}>
                  Add some topics first, then generate your personalized study plan
                </p>
              </div>
            )}
          </div>
        )}

        {/* Today Tab */}
        {activeTab === 'today' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
              Today's Focus
            </h2>
            
            {/* Today's Tasks */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Play size={20} />
                Today's Tasks ({todaysTasks.length})
              </h3>
              
              {todaysTasks.length > 0 ? (
                <div style={styles.grid}>
                  {todaysTasks.map(task => (
                    <div key={task.id} style={{
                      ...styles.taskCard,
                      ...(task.completed ? styles.completedTask : {})
                    }}>
                      <div style={styles.flexBetween}>
                        <div style={styles.flexRow}>
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            style={{
                              ...styles.iconButton,
                              color: task.completed ? '#059669' : '#9ca3af'
                            }}
                          >
                            {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                          </button>
                          <div>
                            <h4 style={{
                              fontWeight: '500',
                              color: task.completed ? '#6b7280' : '#1f2937',
                              textDecoration: task.completed ? 'line-through' : 'none',
                              margin: 0
                            }}>
                              {task.topic} - {task.subtopic}
                            </h4>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                              {task.type} • {task.duration} mins
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: complexityOptions[task.complexity].color,
                            color: complexityOptions[task.complexity].textColor
                          }}>
                            {task.complexity}
                          </span>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: priorityOptions[task.priority].color,
                            color: priorityOptions[task.priority].textColor
                          }}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.taskCard}>
                  <div style={{ textAlign: 'center', padding: '32px' }}>
                    <CheckCircle size={32} color="#059669" style={{ margin: '0 auto 8px' }} />
                    <p style={{ color: '#6b7280' }}>No tasks scheduled for today. Great job staying ahead!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Tasks */}
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock size={20} />
                Upcoming Tasks
              </h3>
              
              {upcomingTasks.length > 0 ? (
                <div style={styles.grid}>
                  {upcomingTasks.map(task => (
                    <div key={task.id} style={styles.taskCard}>
                      <div style={styles.flexBetween}>
                        <div>
                          <h4 style={{ fontWeight: '500', color: '#1f2937', margin: 0 }}>
                            {task.topic} - {task.subtopic}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                            {task.type} • {task.duration} mins • Due: {task.date}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: complexityOptions[task.complexity].color,
                            color: complexityOptions[task.complexity].textColor
                          }}>
                            {task.complexity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.taskCard}>
                  <div style={{ textAlign: 'center', padding: '32px' }}>
                    <Clock size={32} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
                    <p style={{ color: '#6b7280' }}>No upcoming tasks scheduled</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyBuddy;