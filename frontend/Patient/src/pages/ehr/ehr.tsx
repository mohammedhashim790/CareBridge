import {CartesianGrid, Dot, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Activity, FileText, Moon, Zap} from "lucide-react";
import "./ehr.css";
import { useState } from "react";
import {Link} from "react-router-dom";
import Modal from "../../components/ehr/Modal";
import { useMyHealthRecordsForToday, useMyBloodCount } from '../../hooks/useHealthRecords';

const EHR = () => {
    const [selectedPoint, setSelectedPoint] = useState<{
        month: string,
        date: string,
        value: number,
        metric: string,
        unit: string,
    } | null>()
    const [modalOpen, setModalOpen] = useState(false);

    const handleDataPointClick = (data:any, dataKey:any) => {
        setSelectedPoint({
            month: data.month,
            date: data.date,
            value: data[dataKey],
            metric: dataKey === "redBloodCells" ? "Red Blood Cells" : "White Blood Cells",
            unit: dataKey === "redBloodCells" ? "million cells/μL" : "thousand cells/μL",
        })
    }

    const CustomTooltip = (props: { active: any, payload: any[], label:string } | null) => {
    if(props && props.active && props.payload && props.payload.length) {
        // Get the full data point to access the month field
        const dataPoint = props.payload[0]?.payload;
        
        return (<div className="chart-tooltip">
            <p className="tooltip-label">{dataPoint?.date + dataPoint?.month || props.label}</p>
            {(props.payload ?? []).map((entry:any, index:any) => (
                <p key={index} className="tooltip-value" style={{color: entry.color}}>
                    {`${entry.name}: ${entry.value} ${entry.dataKey === "redBloodCells" ? "M cells/μL" : "K cells/μL"}`}
                </p>
            ))}
        </div>)
    }
    return null
}

    const CustomDot = (props: any) => {
        const {cx, cy, payload, dataKey} = props
        return (<Dot
            cx={cx}
            cy={cy}
            r={4}
            fill={dataKey === "redBloodCells" ? "#780606" : "#3b82f6"}
            stroke={dataKey === "redBloodCells" ? "#4c1818" : "#1d3b78"}
            strokeWidth={2}
            onClick={() => handleDataPointClick(payload, dataKey)}
            style={{cursor: "pointer"}}
            className="chart-dot"
        />)
    }

    const { data } = useMyHealthRecordsForToday();
    const { data: bloodCountData } = useMyBloodCount();

    return (
      <div className="ehr-container">
        {/* Main Content */}
        <main>
            {data === undefined &&
              <button
                className="my-6 px-4 py-4 bg-primary rounded text-white hover:bg-hover hover:cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
              Log Today’s Health Data
              </button>
            }
            {modalOpen && <Modal closeModal={() => setModalOpen(false)} />}

            {/* Metrics Cards */}
              <section className="metrics-section">
                <div className="metric-card">
                    <div className="metric-icon steps-icon">
                        <Activity size={24}/>
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">Steps</span>
                        <span className="metric-value">{data?.steps !== undefined ? data.steps : 0}</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon sleep-icon">
                        <Moon size={24}/>
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">Sleep</span>
                        <span className="metric-value">
                            {data?.sleep?.hours !== undefined ? data?.sleep?.hours : 0}h{' '}
                            {data?.sleep?.minutes !== undefined ? data?.sleep?.minutes : 0}m
                        </span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon operations-icon">
                        <Zap size={24}/>
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">Operations</span>
                        <span className="metric-value">
                            {data?.operations !== undefined ? data?.operations : 0}
                        </span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon history-icon">
                        <FileText size={24}/>
                    </div>
                    <Link to={'/a/records'}>
                        <div className="metric-content">
                            <span className="metric-label">Medical history</span>
                            <span className="metric-value">5</span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Chart Section */}
            <section className="chart-section">
                <div className="chart-container">
                    <div className="chart-header">
                        <h2 className="chart-title">CBC (Complete Blood Count)</h2>
                        {selectedPoint && (<div className="selected-point-info">
                  <span className="selected-point-text">
                    {selectedPoint.month}: {selectedPoint?.metric} = {selectedPoint?.value} {selectedPoint?.unit}
                  </span>
                            <button className="clear-selection" onClick={() => setSelectedPoint(null)}>
                                ×asdasd
                            </button>
                        </div>)}
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={Array.isArray(bloodCountData) ? bloodCountData : []} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff"/>
                                <XAxis dataKey="month" axisLine={false} tickLine={false}
                                       tick={{fontSize: 12, fill: "#6b7280"}}/>
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "#6b7280"}}
                                       domain={[0, 10]}/>
                                <Tooltip content={<CustomTooltip active={undefined} payload={[]} label={""}/>}/>
                                <Line
                                    type="bump"
                                    dataKey="redBloodCells"
                                    stroke="#780606"
                                    strokeWidth={3}
                                    dot={<CustomDot dataKey="redBloodCells"/>}
                                    activeDot={{r: 6, stroke: "#780606", strokeWidth: 2}}
                                    name="Red Blood Cells"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="whiteBloodCells"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={<CustomDot dataKey="whiteBloodCells"/>}
                                    activeDot={{r: 6, stroke: "#3b82f6", strokeWidth: 2}}
                                    name="White Blood Cells"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* Detail Cards Section */}
            <section className="details-section">
                <div className="detail-card">
                    <h3 className="detail-title">Blood Glucose</h3>
                    <div className="detail-date">
                        <span className="day">WEDNESDAY</span>
                        <span className="date-time">06/10/21 7:00 am</span>
                    </div>
                    <div className="detail-metrics">
                        <div className="detail-metric elevated">
                            <span className="metric-status">ELEVATED</span>
                            <span className="metric-number">173 Mg/dL</span>
                        </div>
                        <div className="detail-metric shot">
                            <span className="metric-status">SHOT</span>
                            <span className="metric-number">U-100</span>
                        </div>
                    </div>
                </div>

                <div className="detail-card">
                    <h3 className="detail-title">SLEEP</h3>
                    <div className="detail-date">
                        <span className="day">WEDNESDAY</span>
                        <span className="date-time">05/10/21-06/10/21</span>
                    </div>
                    <div className="detail-metrics">
                        <div className="detail-metric asleep">
                            <span className="metric-status">TOTAL ASLEEP</span>
                            <span className="metric-number">5h 15m</span>
                        </div>
                        <div className="detail-metric in-bed">
                            <span className="metric-status">TOTAL IN BED</span>
                            <span className="metric-number">6h 20m</span>
                        </div>
                    </div>
                </div>

                <div className="detail-card">
                    <h3 className="detail-title">Upcoming Medicine reminder</h3>
                    <div className="detail-date">
                        <span className="day">WEDNESDAY</span>
                        <span className="date-time">06/10/21 7:00 am</span>
                    </div>
                    <div className="detail-metrics">
                        <div className="detail-metric steps">
                            <span className="metric-status">Paracetamol</span>
                            <span className="metric-number">1 Tablet (12:01 AM)</span>
                        </div>
                        <div className="detail-metric distance">
                            <span className="metric-status">Imoinasad</span>
                            <span className="metric-number">1 Tablet (12:00 AM)</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
      </div>
    );
}

export default EHR;
