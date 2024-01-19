import os, pathlib, shutil, json


CWD = os.getcwd()


JS_FILES = []


def list_files(path):
    stats = os.listdir(path)
    for stat in stats:
        current_path = os.path.join(CWD, path, stat)
        if os.path.isdir(current_path) and current_path.count("node_modules") < 1:
            list_files(current_path)
        elif pathlib.Path(current_path).suffix == ".js":
            JS_FILES.append(current_path)


list_files(CWD)


def copy_files(FILES_PATH=[]):
    dir_path = os.path.join(CWD, "stream-tut")
    os.makedirs(dir_path, exist_ok=True)
    for cPath in FILES_PATH:
        toCopyPath = cPath.split("/").pop()
        shutil.copy(cPath, os.path.join(dir_path, toCopyPath))


copy_files(JS_FILES)
print(json.dumps(JS_FILES, indent=4))
