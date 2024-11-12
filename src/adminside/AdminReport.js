import React, { useState, useEffect } from 'react';
import Sidebar from '../adminside/Sidebar';
import { Bar, Line } from 'react-chartjs-2'; // Import the Bar and Line components
import Chart from 'chart.js/auto';
import { Container, Button } from 'react-bootstrap';
import '../styles/adminhome.css';
import supabase from '../supabase';

function AdminReport() {
    const [treeData, setTreeData] = useState([]);
    const [feedbackData, setFeedbackData] = useState([]);
    const [blogpostData, setBlogpostData] = useState([]);
    const [treeStatusData, setTreeStatusData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: treePinsData } = await supabase
                .from('treepins')
                .select('dateadded, speciesid')
                .eq('pinverified', true);

            const { data: treeData } = await supabase
                .from('treedata')
                .select('speciesid, name, color');

            // Fetch tree status data from tree_status table
            const { data: treeStatus } = await supabase
                .from('treepins')
                .select('status, dateadded');

            // Map speciesid to name and color
            const speciesMap = {};
            treeData.forEach((tree) => {
                speciesMap[tree.speciesid] = {
                    name: tree.name,
                    color: tree.color || '#000000',
                };
            });

            // Map tree pins data with names and colors
            const mappedTreePinsData = treePinsData.map((tree) => ({
                ...tree,
                speciesInfo: speciesMap[tree.speciesid] || {},
            }));

            const { data: feedbacksData } = await supabase
                .from('feedbacks')
                .select('created_at');

            const { data: blogpostsData } = await supabase
                .from('blogposts')
                .select('created_at');

            setTreeData(mappedTreePinsData);
            setFeedbackData(feedbacksData || []);
            setBlogpostData(blogpostsData || []);
            setTreeStatusData(treeStatus || []);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const getCountsByMonth = (data) => {
        const counts = {};
        data.forEach((item) => {
            const date = new Date(item.created_at || item.dateadded);
            const month = date.toLocaleString('en-US', { month: 'long' });
            if (counts[month]) {
                counts[month]++;
            } else {
                counts[month] = 1;
            }
        });
        return counts;
    };

    const getMonthLabels = () => {
        const months = [];
        const currentDate = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), i, 1);
            months.push(date.toLocaleString('default', { month: 'long' }));
        }
        return months;
    };

    const getTreeChartData = () => {
        const monthLabels = getMonthLabels();
        const treeChartData = {};

        treeData.forEach((tree) => {
            const date = new Date(tree.dateadded);
            const monthIndex = date.getMonth();
            const year = date.getFullYear();
            const speciesName = tree.speciesInfo.name;
            const color = tree.speciesInfo.color || '#000000';

            if (!treeChartData[speciesName]) {
                treeChartData[speciesName] = {
                    label: speciesName,
                    data: Array(12).fill(0),
                    backgroundColor: Array(12).fill(color),
                };
            }

            treeChartData[speciesName].data[monthIndex] += 1;
        });

        return Object.values(treeChartData);
    };

    const getTreeStatusData = () => {
        const monthLabels = getMonthLabels();
        const statusCounts = {
            "Fruiting": Array(12).fill(0),
            "Growing": Array(12).fill(0),
            "Flowering": Array(12).fill(0),
            "Bearing": Array(12).fill(0)
        };

        treeStatusData.forEach((tree) => {
            const date = new Date(tree.dateadded);
            const monthIndex = date.getMonth();
            if (statusCounts[tree.status]) {
                statusCounts[tree.status][monthIndex] += 1;
            }
        });

        return {
            labels: monthLabels,
            datasets: [
                {
                    label: 'Fruiting Trees',
                    data: statusCounts["Fruiting"],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                },
                {
                    label: 'Growing Trees',
                    data: statusCounts["Growing"],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    fill: false
                },
                {
                    label: 'Flowering Trees',
                    data: statusCounts["Flowering"],
                    borderColor: 'rgba(255, 206, 86, 1)',
                    fill: false
                },
                {
                    label: 'Bearing Trees',
                    data: statusCounts["Bearing"],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false
                }
            ]
        };
    };

    const downloadCSV = () => {
        const headers = ['Status', ...getMonthLabels()];
        const rows = [];

        const statusCounts = getTreeStatusData().datasets;

        statusCounts.forEach(status => {
            rows.push([status.label, ...status.data]);
        });

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(row => row.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tree_status_report.csv");
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    };

    const data = {
        labels: getMonthLabels(),
        datasets: getTreeChartData(),
    };

    const options = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const feedbackCountsByMonth = getCountsByMonth(feedbackData);
    const blogpostCountsByMonth = getCountsByMonth(blogpostData);

    const feedbackChartData = {
        labels: Object.keys(feedbackCountsByMonth),
        datasets: [
            {
                label: 'Number of Feedbacks per Month',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
                hoverBorderColor: 'rgba(54, 162, 235, 1)',
                data: Object.values(feedbackCountsByMonth),
            },
        ],
    };

    const blogpostChartData = {
        labels: Object.keys(blogpostCountsByMonth),
        datasets: [
            {
                label: 'Number of Blog Posts per Month',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
                hoverBorderColor: 'rgba(75, 192, 192, 1)',
                data: Object.values(blogpostCountsByMonth),
            },
        ],
    };

    const treeStatusChartData = getTreeStatusData();

    return (
        <div className="App">
            <Sidebar />
            <section className="tree-section">
                <h2 className='overview13'>Reports:</h2>
                <Container style={{ backgroundColor: 'white', color: 'black', borderRadius: '25px', padding: '50px' }}>
                    <h3>Tree Pins Added:</h3>
                    <Bar data={data} options={options} />
                    <br /><br /><hr /><br />
                    <h3>Blog Posts:</h3>
                    <Bar data={blogpostChartData} />
                    <br /><br /><hr /><br />
                    <h3>Feedback Posted:</h3>
                    <Bar data={feedbackChartData} />
                    <br /><br /><hr /><br />
                    <h3>Tree Status:</h3>
                    <Line data={treeStatusChartData} />
                    <Button onClick={downloadCSV} style={{ marginTop: '20px' }}>Download Tree Status Data as CSV</Button>
                </Container>
            </section>
        </div>
    );
}

export default AdminReport;
