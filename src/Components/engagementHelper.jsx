import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const EngagementHelper = {
  engagementMessageOverTimeChartOptions: (messageCountList, channels) => {
    const channelMessageCounts = {};

    // Count messages for each channel on different dates
    messageCountList?.forEach((message) => {
      const channelId = message.channelId;
      const date = new Date(message.timeBucket).toISOString().slice(0, 10);

      if (!channelMessageCounts[channelId]) {
        channelMessageCounts[channelId] = {};
      }

      if (!channelMessageCounts[channelId][date]) {
        channelMessageCounts[channelId][date] = 0;
      }

      channelMessageCounts[channelId][date] += parseInt(message.count);
    });

    // Filter out channels that have messages on only one date
    const channelsWithMultipleDates = Object.keys(channelMessageCounts).filter(
      (channelId) => Object.keys(channelMessageCounts[channelId]).length > 1
    );

    // console.log("channelsWithMultipleDates", messageCountList);

    // Prepare series data for Highcharts
    const series = channelsWithMultipleDates.map((channelId) => {
      const channel = channels.find((channel) => channel.id === channelId);
      const channelName = channel ? channel.name : channelId;

      const data = Object.keys(channelMessageCounts[channelId]).map((date) => {
        return [
          new Date(date).getTime(),
          channelMessageCounts[channelId][date],
        ];
      });

      return {
        name: channelName,
        data: data,
      };
    });

    const options = {
      title: {
        text: "Engagement Messages Over Time",
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "Date",
        },
      },
      yAxis: {
        title: {
          text: "Message Count",
        },
      },
      series: series,
    };

    return options;
  },
};

const EngagementMessagesOverTime = ({ messageCountList, channels }) => {
  const options = EngagementHelper.engagementMessageOverTimeChartOptions(
    messageCountList,
    channels
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default EngagementMessagesOverTime;
