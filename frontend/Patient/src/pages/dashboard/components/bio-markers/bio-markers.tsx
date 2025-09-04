import {LineChart, PenLine} from "lucide-react";
import {useDialog} from "../../../../components/dialog/dialog";
import {SimpleMedicalForm} from "../edit-bio-markers/edit-bio-markers.tsx";
import {BioMarkersService} from "../../../../../../shared-modules/src/api/bio_markers.service.ts";
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from "react-loading-skeleton";
import {useQuery} from "@tanstack/react-query";


export interface IBioMarkers {
    heartRate?: string;
    height?: string;
    weight?: number;
    bloodGroup?: string;
    allergies?: Array<string>;
    pastIllness?: string;
    patientId?: string;
}

export const BioMarkers: React.FC = () => {


    const {showDialog, closeDialog} = useDialog();

    const api = new BioMarkersService("https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api");
    const fetchBioMarker = async () => {
        const sampleRes: IBioMarkers = {};
        const res = await api.getBioMarker();
        return res.result;
    }

    const {data, isPending, refetch} = useQuery({
        queryKey: ["bioMarker"], queryFn: fetchBioMarker
    })


    return (<div className="card">
        <div className="flex items-center gap-2 mb-4">
            <LineChart size={20} className="text-gray-500"/>
            <h3 className="text-lg font-semibold text-gray-800">BioMarkers</h3>
            <span className="text-gray-500" style={{cursor: 'pointer', marginLeft: 'auto'}} onClick={() => {
                showDialog({
                    template: SimpleMedicalForm, params: {
                        isBarrierDismissible: true
                    }, componentProps: {
                        closeDialog: async () => {
                            await refetch();
                            closeDialog();
                        },
                    }
                })
            }}>
                <button className="text-sm text-gray-500 hover:text-gray-700" style={{
                    display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: "10px"
                }}>
                    <PenLine size={12}/>
                    Edit
                </button>
            </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
            {isPending ? (<><Skeleton/>
                <Skeleton/>
                <Skeleton/>
                <Skeleton/></>) : (<>
                <div className="flex flex-col items-center">
                    <p className="text-blue-600 text-sm font-medium">Heart Rate</p>
                    <p className="text-lg font-bold text-gray-800">{data?.heartRate ?? 'N/A'}</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-blue-600 text-sm font-medium">Height</p>
                    <p className="text-lg font-bold text-gray-800">{data!.height ?? "N/A"}</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-blue-600 text-sm font-medium">Weight</p>
                    <p className="text-lg font-bold text-gray-800">{(data.weight) ? data.weight + "kgs" : "N/A"}</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-blue-600 text-sm font-medium">Blood</p>
                    <p className="text-lg font-bold text-gray-800">{data?.bloodGroup ?? "N/A"}</p>
                </div>
            </>)}
        </div>
    </div>);
}
