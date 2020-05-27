from typing import List
from datetime import datetime
from flask import Markup


class Log:
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

    def __repr__(self):
        return F"<LOG: {self.start_date} {self.end_date} {self.status}>"

    def __html__(self):
        return Markup(F"LOG: {self.start_date} {self.end_date} {self.status}")


class LogCollection:

    datetime_format = "%Y.%m.%d - %H:%M:%S"

    def __init__(self, path):
        self.path = path
        logs = self.load_logs()
        parsed_logs = self._parse_logs(logs)
        parsed_logs = self._merge_logs(parsed_logs)
        self.logs = parsed_logs
        self._host_iter = 0

    def load_logs(self):
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
        return "There was connection" in line

    @classmethod
    def _get_date(cls, line: str):
        line = line.replace("[", "]")
        date_str = line.split("]")[1]
        date = datetime.strptime(date_str, cls.datetime_format)
        return date
