import Doctor from '../../../assets/images/doctor.svg'
import Call from '../../../assets/images/transparent-call.svg'

const SideBarView = () => {
    return (<div className="hidden lg:flex lg:flex-col lg:justify-between lg:w-1/3 lg:h-full lg:bg-primary">
            <div className="flex flex-row w-full justify-between p-6">
                <p className="font-bold text-xl text-white">CareBridge</p>
            </div>

            <div className="relative justify-items-center">
                <img src={Doctor} className="absolute width-100 bottom-1"></img>
                <img
                    src={Call}
                    className="absolute bottom-10 left-2/5 transform -translate-x-1/2"
                ></img>
            </div>
        </div>);
};

export default SideBarView;
