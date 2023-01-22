script_path="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $script_path

. venv/bin/activate
python main.py
