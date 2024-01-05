import React, { useEffect, useState } from 'react';
import './App.css';

interface Event {
  key: string;
  eventFireDateTime: string;
  status: 'COMPLETED' | 'FAILED' | 'START';
  value: any;
}

interface Span {
  startTime: string;
  endTime: string;
  events: Event[];
}

type GroupedEvents = Record<string, Span[]>;

const App: React.FC = () => {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents>({});

  useEffect(() => {
    // Mocked data of events
    const events: Event[] = [
      { key: 'A', eventFireDateTime: '2022-01-01 10:00:00', status: 'START', value: 'Event A1' },
      { key: 'A', eventFireDateTime: '2022-01-01 10:00:05', status: 'COMPLETED', value: 'Event A2' },
      { key: 'B', eventFireDateTime: '2022-01-01 10:00:10', status: 'START', value: 'Event B1' },
      { key: 'B', eventFireDateTime: '2022-01-01 10:00:15', status: 'FAILED', value: 'Event B2' },
      { key: 'C', eventFireDateTime: '2022-01-01 10:00:20', status: 'START', value: 'Event C1' },
      { key: 'C', eventFireDateTime: '2022-01-01 10:00:25', status: 'START', value: 'Event C2' },
      { key: 'C', eventFireDateTime: '2022-01-01 10:00:30', status: 'COMPLETED', value: 'Event C3' },
      { key: 'D', eventFireDateTime: '2022-01-01 10:00:35', status: 'START', value: 'Event D1' },
    ];

    // Function to group the events
    const groupEvents = (events: Event[]): GroupedEvents => {
      const grouped: GroupedEvents = {};

      events.forEach(event => {
        if (!grouped[event.key]) {
          grouped[event.key] = [];
        }

        if (event.status === 'START') {
          grouped[event.key].push({
            startTime: event.eventFireDateTime,
            endTime: event.eventFireDateTime,
            events: [event],
          });
        } else {
          const currentGroup = grouped[event.key];
          const lastSpan = currentGroup[currentGroup.length - 1];

          if (lastSpan) {
            lastSpan.events.push(event);

            if (event.status === 'COMPLETED' || event.status === 'FAILED') {
              lastSpan.endTime = event.eventFireDateTime;
            }
          }
        }
      });

      return grouped;
    };

    const result = groupEvents(events);
    setGroupedEvents(result);
  }, []);

  return (
    <div className="container">
      <h1>Event Grouping</h1>
      <div>
        {Object.entries(groupedEvents).map(([key, spans]) => (
          <div key={key} className="box">
            <h2>Key: {key}</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {spans.map((span, index) => (
                  <tr key={index}>
                    <td>{span.startTime}</td>
                    <td>{span.endTime}</td>
                    <td>{span.events.map(event => event.status).join(', ')}</td>
                    <td>{span.events.map(event => event.value).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

