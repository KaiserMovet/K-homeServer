import json
from typing import List
from datetime import datetime, timedelta
from flask import Markup
import dateutil.relativedelta


class Log:

    datetime_format = "%Y.%m.%d - %H:%M:%S"

    def __init__(self, start_date, end_date, status):
        self.start_date = start_date
        self.end_date = end_date
        self.status = status

    def get_delta(self):
        return self.end_date - self.start_date

    def merge(self, log: "Log") -> "Log":
        if log.status != self.status:
            return None
        start_date = min([self.start_date, log.start_date])
        end_date = max([self.end_date, log.end_date])
        return Log(start_date, end_date, self.status)

    def msg(self):
        time_log = self.end_date.strftime("%Y.%m.%d - %H:%M:%S")
        if self.status:
            has_connection_log = "There was connection for"
        else:
            has_connection_log = "There was no connection for"
        time_with_con = self.get_delta()
        time_with_con_log = F"{time_with_con.days} days, "\
            F"{time_with_con.seconds//3600} hours and "\
            F"{(time_with_con.seconds//60)%60} minutes"
        return F"[{time_log}] {has_connection_log} {time_with_con_log}"

    def cut(self, start_date=None, end_date=None):
        if start_date is None or start_date < self.start_date:
            start_date = self.start_date
        if end_date is None or end_date > self.end_date:
            end_date = self.end_date
        if start_date > end_date:
            return None
        return Log(start_date, end_date, self.status)

    def __repr__(self):
        return F"<LOG: {self.start_date} {self.end_date} {self.status}>"

    def __html__(self):
        return Markup(F"LOG: {self.start_date} {self.end_date} {self.status}")


class LogCollection:

    datetime_format = "%Y.%m.%d - %H:%M:%S"

    def __init__(self, path=None, logs=None):
        if path:
            self.path = path
            logs = self._load_logs()
            parsed_logs = self._parse_logs(logs)
            parsed_logs = self._merge_logs(parsed_logs)
            self.logs = parsed_logs
            self.logs.reverse()
        elif logs:
            self.logs = logs
        if self.logs:
            self.start_date = self.logs[-1].start_date
            self.end_date = self.logs[0].end_date
        else:
            self.start_date = None
            self.end_date = None
        self._host_iter = 0

    def get_logs(self):
        return self.logs

    def get_collection_from_last_month(self):
        all_logs = self.get_logs()
        current_time = all_logs[0].end_date
        month_ago = current_time + \
            dateutil.relativedelta.relativedelta(months=-1)
        logs_from_month = []

        for log in all_logs:
            if log.start_date >= month_ago:
                logs_from_month.append(log)
            elif log.end_date > month_ago:
                logs_from_month.append(log.cut(start_date=month_ago))
            else:
                break
        return LogCollection(logs=logs_from_month)

    def _load_logs(self):
        try:
            with open(self.path) as file:
                data = file.readlines()
        except FileNotFoundError:
            data = []
        return data

    def __iter__(self):
        self._host_iter = 0
        return self

    def __next__(self):
        if self._host_iter < len(self.logs):
            log = self.logs[self._host_iter]
            self._host_iter += 1
            return log
        raise StopIteration

    @classmethod
    def _parse_logs(cls, logs: List[str]) -> List[Log]:
        parsed_logs = []
        if len(logs) == 0:
            return parsed_logs
        for previous_log, log in zip(logs[:-1], logs[1:]):
            if not log:
                continue
            start_time = cls._get_date(previous_log)
            end_time = cls._get_date(log)
            status = cls._get_status(log)
            parsed_logs.append(Log(start_time, end_time, status))
        return parsed_logs

    @staticmethod
    def _merge_logs(parsed_logs):
        merged_logs = []
        merged_logs.append(parsed_logs[0])
        for log in parsed_logs[1:]:
            merged_log = merged_logs[-1].merge(log)
            if merged_log is not None:
                merged_logs[-1] = merged_log
            else:
                merged_logs.append(log)
        return merged_logs

    @staticmethod
    def _get_status(line: str):
        return "There was connection" in line or "There is connection" in line

    @classmethod
    def _get_date(cls, line: str):
        line = line.replace("[", "]")
        date_str = line.split("]")[1]
        date = datetime.strptime(date_str, cls.datetime_format)
        return date

    def to_json(self):
        data = {}
        data["start_date"] = [log.start_date.strftime(
            "%Y.%m.%d - %H:%M:%S") for log in self.logs]
        data["end_date"] = [log.end_date.strftime(
            "%Y.%m.%d - %H:%M:%S") for log in self.logs]
        data["status"] = [log.status for log in self.logs]

        return json.dumps(data)
