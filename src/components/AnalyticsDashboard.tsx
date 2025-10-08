import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

interface AnalyticsDashboardProps {
  language: string;
}

const COLORS = {
  positive: "hsl(142 76% 36%)",
  negative: "hsl(0 84% 60%)",
  neutral: "hsl(38 92% 50%)",
};

export const AnalyticsDashboard = ({ language }: AnalyticsDashboardProps) => {
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("feedback-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback" },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const positive = data?.filter((f) => f.sentiment === "positive").length || 0;
      const negative = data?.filter((f) => f.sentiment === "negative").length || 0;
      const neutral = data?.filter((f) => f.sentiment === "neutral").length || 0;

      setStats({
        total: data?.length || 0,
        positive,
        negative,
        neutral,
      });

      setRecentFeedback(data?.slice(0, 10) || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: language === "ta" ? "நேர்மறை" : "Positive", value: stats.positive },
    { name: language === "ta" ? "எதிர்மறை" : "Negative", value: stats.negative },
    { name: language === "ta" ? "நடுநிலை" : "Neutral", value: stats.neutral },
  ];

  const barData = [
    {
      name: language === "ta" ? "நேர்மறை" : "Positive",
      count: stats.positive,
      fill: COLORS.positive,
    },
    {
      name: language === "ta" ? "எதிர்மறை" : "Negative",
      count: stats.negative,
      fill: COLORS.negative,
    },
    {
      name: language === "ta" ? "நடுநிலை" : "Neutral",
      count: stats.neutral,
      fill: COLORS.neutral,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ta" ? "மொத்த கருத்துகள்" : "Total Feedback"}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ta" ? "நேர்மறை" : "Positive"}
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.positive}</div>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ta" ? "எதிர்மறை" : "Negative"}
            </CardTitle>
            <ThumbsDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.negative}</div>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ta" ? "நடுநிலை" : "Neutral"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.neutral}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>
              {language === "ta" ? "உணர்வு விநியோகம்" : "Sentiment Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Object.values(COLORS)[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>
              {language === "ta" ? "உணர்வு எண்ணிக்கை" : "Sentiment Count"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};