import pandas as pd

df = pd.read_csv('owid-migration-flows.csv')
df = df[df['Year']==2020].filter(regex ='Immigrants to').sum().sort_values()

print(df.to_string()) 