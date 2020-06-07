from typing import List
import dateutil.relativedelta
from datetime import datetime
from statistics import mean
import json


class Log:

    datetime_format = "%Y.%m.%d - %H:%M:%S"

    def __init__(self, date, download, upload):
        self.date = date
        self.download = download
        self.upload = upload

    def __repr__(self):
        return F"<LOG: {self.date} {self.download} {self.upload}>"


class LogCollection:

    datetime_format = "%Y.%m.%d - %H:%M:%S"
    datetime_format_short = "%Y.%m.%d %H:%M"

    def __init__(self, path=None, logs=None):
        if path:
            self.path = path
            logs = self._load_logs()
            parsed_logs = self._parse_logs(logs)
            self.logs = parsed_logs
            self.logs.reverse()
        elif logs:
            self.logs = logs
        self._host_iter = 0

    def _load_logs(self):
        try:
            with open(self.path) as file:
                data = file.readlines()
        except FileNotFoundError:
            data = []
        return data

    def get_collection_from_last_month(self):
        all_logs = self.get_logs()
        current_time = all_logs[0].date
        month_ago = current_time + \
            dateutil.relativedelta.relativedelta(months=-1)
        logs_from_month = []

        for log in all_logs:
            if log.date >= month_ago:
                logs_from_month.append(log)
            else:
                break
        return LogCollection(logs=logs_from_month)

    @classmethod
    def _parse_logs(cls, logs: List[str]) -> List[Log]:
        parsed_logs = []
        for log in logs:
            date = cls._get_date(log)
            speeds = log.split()[-2:]
            download = float(speeds[0])
            print(speeds[1])
            upload = float(speeds[1])
            parsed_logs.append(Log(date, download, upload))
        return parsed_logs

    @classmethod
    def _get_date(cls, line: str):
        line = line.replace("[", "]")
        date_str = line.split("]")[1]
        date = datetime.strptime(date_str, cls.datetime_format)
        return date

    def get_logs(self):
        return self.logs

    def get_data_str(self):
        log_date_list = ""
        log_download_list = ""
        log_upload_list = ""
        for log in self.logs:
            log_date_list += \
                F"{log.date.strftime(self.datetime_format_short)}, "
            log_download_list += F"{log.download} "
            log_upload_list += F"{log.upload} "
        if log_date_list:
            log_date_list = log_date_list[:-2]
        return log_date_list, log_download_list, log_upload_list

    def to_json(self):
        data = {}
        data["date"] = [log.date.strftime(
            "%Y.%m.%d - %H:%M:%S") for log in self.logs]
        data["download"] = [log.download for log in self.logs]
        data["upload"] = [log.upload for log in self.logs]

        return json.dumps(data)
