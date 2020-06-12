import yaml
import os


def set_path(path):
    ConfigHandler.config_path = path


def get_config():
    if ConfigHandler.SELF is None:
        ConfigHandler.SELF = ConfigHandler()
    return ConfigHandler.SELF


class ConfigHandlerException(Exception):
    pass


class ConfigHandler:

    config_path = None
    SELF = None

    def __init__(self):
        conf_dict = self._load_file()
        self.INTERNET_CHECK_LOG = conf_dict.get("internet_check_log")
        self.INTERNET_SPEED_LOG = conf_dict.get("internet_speed_log")

    def _load_file(self):
        with open(self.config_path) as file:
            data = file.read()

        if data is None:
            raise ConfigHandlerException(
                F"Cannot read config file in {self.config_path}")
        return yaml.load(data)
