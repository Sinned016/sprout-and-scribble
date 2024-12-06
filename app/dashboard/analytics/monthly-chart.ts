import betweenWeeks from "./between-weeks";
import checkDate from "./check-date";

export const monthlyChart = (chartItems: { date: Date; revenue: number }[]) => {
  return [
    {
      date: "3 weeks ago",
      revenue:
        chartItems
          .filter((order) => betweenWeeks(order.date!, 28, 21))
          .reduce((acc, price) => acc + price.revenue, 0) / 100,
    },
    {
      date: "2 weeks ago",
      revenue:
        chartItems
          .filter((order) => betweenWeeks(order.date!, 21, 14))
          .reduce((acc, price) => acc + price.revenue, 0) / 100,
    },
    {
      date: "1 week ago",
      revenue:
        chartItems
          .filter((order) => betweenWeeks(order.date!, 14, 7))
          .reduce((acc, price) => acc + price.revenue, 0) / 100,
    },
    {
      date: "this week",
      revenue:
        chartItems
          .filter((order) => betweenWeeks(order.date!, 7, 0))
          .reduce((acc, price) => acc + price.revenue, 0) / 100,
    },
  ];
};
