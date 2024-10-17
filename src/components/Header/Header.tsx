import {MenuIcon} from "@/assets/icons/MenuIcon";
import {HeaderMenu} from "@/components/Header/HeaderMenu";
import {getSession} from "@auth0/nextjs-auth0";
import {fetchUserInfo} from "@/components/Header/service";

export default async function Header() {
    const session = await getSession();
    const user = await fetchUserInfo({userId: session?.user?.sub?.split('|')[1]});
    return (<nav className="fixed w-full bg-secondary shadow-xl z-50">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center py-4 px-6">
        <HeaderMenu trigger={<MenuIcon className="cursor-pointer"/>} user={user} />
        <h4 className="font-normal text-sm text-white animate-flip-down animate-once animate-duration-[500ms] animate-delay-500 animate-ease-in">{user?.name}</h4>
        </div>
    </nav>);
}
