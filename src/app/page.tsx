import { redirect } from 'next/navigation';

const Home = async () => {
    redirect('/events');
}

export default Home;