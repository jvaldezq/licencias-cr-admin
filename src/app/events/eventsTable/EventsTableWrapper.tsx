import { IEvent, IEventFilter, ITask, IUser } from '@/lib/definitions';
import { getEventsList } from '@/services/events/getEventsList';
import { EventsTable } from '@/app/events/eventsTable/EventsTable';
import { getTasks } from '@/app/api/task/getTasks';

interface Props {
  filters: string;
  user: IUser;
}

export default async function EventsTableWrapper(props: Props) {
  const { user, filters } = props;
  let data = [] as IEvent[];
  let tasks = [] as ITask[];
  if (filters) {
    const filtersJson = JSON.parse(atob(filters)) as IEventFilter;
    data = await getEventsList(filtersJson);
    tasks = await getTasks(filtersJson);
  }

  return (
    <EventsTable data={data} user={user} filters={filters} tasks={tasks} />
  );
}
